import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { solanaAddress, email } = body;

    if (!solanaAddress || typeof solanaAddress !== "string") {
      return NextResponse.json(
        { ok: false, error: "missing solanaAddress" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.error(
        "[waitlist] GOOGLE_SCRIPT_URL is not set in environment variables"
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "server is not configured. Please set GOOGLE_SCRIPT_URL in .env",
        },
        { status: 500 }
      );
    }

    // Apps Script doPost(e) -> e.parameter ile okuyabilsin diye form-encoded gönderiyoruz
    const params = new URLSearchParams();
    params.set("solanaAddress", solanaAddress.trim());
    params.set("email", (email ?? "").trim());

    console.log("[waitlist] Sending to Google Script:", scriptUrl);

    let res: Response;
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      // Timeout ekle (30 saniye)
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000);

      res = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
        cache: "no-store",
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);
    } catch (fetchErr: any) {
      if (timeoutId) clearTimeout(timeoutId);
      if (fetchErr.name === "AbortError") {
        console.error("[waitlist] Request timeout");
        return NextResponse.json(
          {
            ok: false,
            error: "Request timeout. Please check your Google Script URL.",
          },
          { status: 504 }
        );
      }
      console.error("[waitlist] Fetch error:", fetchErr.message);
      return NextResponse.json(
        { ok: false, error: `Network error: ${fetchErr.message}` },
        { status: 502 }
      );
    }

    // Apps Script CORS kısıtları olabilir; ama sunucu tarafında status görebiliriz
    if (!res.ok) {
      const errorText = await res.text().catch(() => "unknown error");
      console.error(
        "[waitlist] Google Script error:",
        res.status,
        errorText.substring(0, 200)
      );

      // 429 = Too Many Requests (rate limiting)
      if (res.status === 429) {
        return NextResponse.json(
          {
            ok: false,
            error: "Too many requests. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }

      // HTML yanıtı geliyorsa deployment sorunu olabilir
      if (errorText.includes("<!DOCTYPE") || errorText.includes("<html")) {
        console.error(
          "[waitlist] Received HTML instead of JSON - deployment issue?"
        );
        return NextResponse.json(
          {
            ok: false,
            error:
              "Google Script returned HTML. Please check your deployment URL and ensure it's a Web App URL (ends with /exec).",
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: `Google Script error (${res.status}). Check server logs for details.`,
        },
        { status: 502 }
      );
    }

    // Apps Script JSON döndürüyorsa parse etmeye çalışalım
    let data: any = null;
    try {
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          // JSON değilse, text olarak dön
          console.error(
            "[waitlist] Response is not JSON:",
            text.substring(0, 200)
          );
          // Eğer HTML içeriyorsa hata mesajı döndür
          if (text.includes("<!DOCTYPE") || text.includes("<html")) {
            return NextResponse.json(
              {
                ok: false,
                error:
                  "Google Script returned HTML instead of JSON. Check deployment configuration.",
              },
              { status: 502 }
            );
          }
          // JSON değilse ama text varsa, başarılı sayalım
          data = { ok: true };
        }
      }
    } catch (textErr) {
      console.error("[waitlist] Failed to read response:", textErr);
      return NextResponse.json(
        { ok: false, error: "Failed to read response from Google Script." },
        { status: 502 }
      );
    }

    // Google Script'ten gelen error mesajını kontrol et
    if (data && data.error) {
      console.error("[waitlist] Google Script returned error:", data.error);
      console.error("[waitlist] Full response data:", JSON.stringify(data));

      // Sheet bulunamadı hatası için özel mesaj
      if (
        data.error.includes("appendRow") ||
        data.error.includes("null") ||
        data.error.includes("Cannot read")
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Google Sheet configuration error. Please check: 1) Sheet name matches SHEET_NAME in script, 2) Sheet exists in spreadsheet, 3) Script has edit permissions.",
          },
          { status: 502 }
        );
      }
      return NextResponse.json(
        { ok: false, error: `Google Script error: ${data.error}` },
        { status: 502 }
      );
    }

    console.log("[waitlist] Success! Response:", JSON.stringify(data));

    return NextResponse.json(data ?? { ok: true });
  } catch (err: any) {
    console.error("[waitlist] Internal error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "internal_server_error" },
      { status: 500 }
    );
  }
}
