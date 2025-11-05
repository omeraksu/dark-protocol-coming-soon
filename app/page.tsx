"use client";

import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [tokenPrice, setTokenPrice] = useState<string>("$0.9");
  const [countdown, setCountdown] = useState<string>("02:14:27:53");
  const [solanaAddress, setSolanaAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<{
    text: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const response = await fetch("/api/token-price");
        const data = await response.json();
        if (data.price) {
          setTokenPrice(`$${data.price}`);
        }
      } catch (error) {
        console.error("Failed to fetch token price:", error);
      }
    };

    fetchTokenPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchTokenPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 10 Kasım 2025 Pazartesi 18:00 UTC
    const target = new Date(Date.UTC(2025, 10, 10, 18, 0, 0, 0));

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff <= 0) {
        setCountdown("00:00:00:00");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const fmt = (n: number) => String(n).padStart(2, "0");
      setCountdown(
        `${fmt(days)}:${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Frontend artık doğrudan Sheets'e değil, /api/waitlist'e gönderir

  const isLikelySolanaAddress = (value: string) => {
    if (!value) return false;
    const base58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58.test(value) && value.length >= 32 && value.length <= 44;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (!isLikelySolanaAddress(solanaAddress.trim())) {
      setFormMessage({
        text: "Please enter a valid Solana address.",
        color: "#ff6b6b",
      });
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solanaAddress: solanaAddress.trim(),
          email: email.trim(),
        }),
      });

      const data = await res
        .json()
        .catch(() => ({ ok: false, error: "parse_error" }));

      if (!res.ok || !data.ok) {
        const errorMsg = data.error || "server_error";
        if (
          errorMsg.includes("GOOGLE_SCRIPT_URL") ||
          errorMsg.includes("not configured")
        ) {
          setFormMessage({
            text: "Server configuration missing. Please contact administrator.",
            color: "#ffcc00",
          });
        } else {
          setFormMessage({
            text: `Error: ${errorMsg}. Please try again.`,
            color: "#ff6b6b",
          });
        }
        return;
      }

      setFormMessage({
        text: "Submission received. Thank you!",
        color: "#2FF454",
      });
      setSolanaAddress("");
      setEmail("");
    } catch (err: any) {
      console.error("Form submission error:", err);
      setFormMessage({
        text: "Network error. Please check your connection and try again.",
        color: "#ff6b6b",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className='h-[100dvh] sm:min-h-screen flex flex-col relative overflow-hidden sm:overflow-visible'
      style={{
        backgroundImage: 'url("/ChatGPT Image Nov 4, 2025, 11_03_43 AM.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Soft radial vignette and subtle gradient overlay for glassy depth */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.65)_100%)]' />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/30' />
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <svg
        className='absolute inset-0 w-full h-full pointer-events-none'
        xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <linearGradient id='neonGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgba(255,255,255,0)' />
            <stop offset='30%' stopColor='rgba(255,255,255,0)' />
            <stop offset='50%' stopColor='rgba(255,255,255,1)' />
            <stop offset='70%' stopColor='rgba(255,255,255,0)' />
            <stop offset='100%' stopColor='rgba(255,255,255,0)' />
          </linearGradient>
          <filter id='glow'>
            <feGaussianBlur stdDeviation='4' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
        <rect
          x='0'
          y='0'
          width='100%'
          height='100%'
          fill='none'
          stroke='url(#neonGradient)'
          strokeWidth='3'
          strokeDasharray='200 3800'
          strokeDashoffset='4000'
          filter='url(#glow)'
          className='animate-border-flow-360'
          rx='0'
        />
      </svg>

      <header className='max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between relative z-10'>
        <div className='flex items-center gap-1.5 sm:gap-2 select-none'>
          <span className='text-[10px] sm:text-xs text-white/50 px-1.5 sm:px-2 py-0.5 bg-white/5 rounded border border-white/10'>
            coming back
          </span>
        </div>

        <nav className='hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm'>
          <button className='flex items-center gap-2 text-white hover:text-white/80 transition-colors'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            Deposit
          </button>
          <button className='flex items-center gap-2 text-white/30 cursor-not-allowed'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01'
              />
            </svg>
            Swap
          </button>
          <button className='flex items-center gap-2 text-white/30 cursor-not-allowed'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 102 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
              />
            </svg>
            Earn
          </button>
        </nav>

        <div className='w-[100px]'></div>
      </header>

      <main className='flex-1 flex items-center justify-center px-3 sm:px-6 relative z-10'>
        <div className='w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-10'>
          {/* Başlık (eski stil): Dark Protocol + yeşil Returns */}
          <div className='space-y-4 sm:space-y-6'>
            <div className='flex items-center justify-center'>
              <img
                src='/dark-logo.svg'
                alt='Dark'
                width='72px'
                draggable='false'
              />
            </div>
            <span className='block text-emerald-400 text-lg sm:text-2xl md:text-3xl lg:text-4xl'>
              Join the Waitlist
            </span>
            <p className='text-white/50 text-xl sm:text-xl md:text-xl lg:text-2xl'>
              Will you be one of the 50 chosen <br /> to dance in the shadows?
            </p>
            <div className='h-px w-20 sm:w-32 mx-auto bg-gradient-to-b from-transparent via-emerald-400/60 to-transparent' />
          </div>

          {/* Form (glass) başlık ve açıklama arasına taşındı */}
          <div className='w-full max-w-sm sm:max-w-md mx-auto rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='relative'>
                <input
                  type='text'
                  inputMode='text'
                  autoComplete='off'
                  autoCorrect='off'
                  autoCapitalize='none'
                  spellCheck={false}
                  placeholder='Solana address'
                  value={solanaAddress}
                  onChange={(e) => setSolanaAddress(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-base placeholder:text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/30 backdrop-blur-xl'
                  required
                />
                <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10' />
              </div>
              <div className='relative'>
                <input
                  type='email'
                  inputMode='email'
                  autoComplete='email'
                  autoCorrect='off'
                  autoCapitalize='none'
                  spellCheck={false}
                  placeholder='Email (optional)'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-base placeholder:text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/30 backdrop-blur-xl'
                />
                <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10' />
              </div>
              <div className='text-emerald-300 font-semibold text-center tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(16,185,129,0.25)]'>
                {countdown}
              </div>
              <button
                type='submit'
                disabled={submitting}
                className='w-full py-3 rounded-xl bg-emerald-400 text-black font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-emerald-300 transition disabled:opacity-60 border border-emerald-200/50 backdrop-blur-xl'>
                {submitting ? "Sending..." : "Join Waitlist"}
              </button>
              {formMessage ? (
                <div
                  className='text-center text-sm'
                  style={{ color: formMessage.color }}>
                  {formMessage.text}
                </div>
              ) : null}
            </form>
          </div>

          {/* Açıklama metinleri (gri/beyaz) */}
          <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-white/50 leading-relaxed font-jetbrains font-light px-4'>
            Dark is coming back online.
          </p>
        </div>
      </main>

      <footer className='max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-8 relative z-10'>
        <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-[11px] sm:text-sm text-white/40'>
          <img
            src='/dark-logo.svg'
            alt='Dark'
            className='h-5 opacity-60 select-none'
            draggable='false'
          />
          <div className='h-4 w-px bg-white/20' />
          <a
            href='https://jup.ag/swap?sell=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&buy=FmQ7v2QUqXVVtAXkngBh3Mwx7s3mKT55nQ5Z673dURYS'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors cursor-pointer'>
            {tokenPrice}
          </a>
          <a
            href='https://x.com/privateLP'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors'>
            x.com
          </a>
          <a
            href='https://v2.realms.today/dao/EJ5vp5ivz4nKmuRqTYMDYMBBKGwrr5BG3w5hk7bMRAvB/proposals'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors'>
            governance
          </a>
          <a
            href='https://discord.com/invite/X9fvtuAq9H'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors'>
            discord
          </a>
          <a
            href='https://t.me/+r4wLMNGv-MRhZThh'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors'>
            telegram
          </a>
        </div>
      </footer>
    </div>
  );
}
