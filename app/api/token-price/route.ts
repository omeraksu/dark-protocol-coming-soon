export async function GET() {
  try {
    const tokenAddress = "FmQ7v2QUqXVVtAXkngBh3Mwx7s3mKT55nQ5Z673dURYS"

    const jupiterResponse = await fetch(`https://lite-api.jup.ag/price/v3?ids=${tokenAddress}`, {
      next: { revalidate: 30 },
    })

    if (jupiterResponse.ok) {
      const data = await jupiterResponse.json()
      const tokenData = data[tokenAddress]

      if (tokenData?.usdPrice) {
        return Response.json({
          price: tokenData.usdPrice.toFixed(2),
          priceChange24h: tokenData.priceChange24h,
        })
      }
    }

    const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
      next: { revalidate: 30 },
    })

    if (dexResponse.ok) {
      const dexData = await dexResponse.json()
      const pair = dexData.pairs?.[0]

      if (pair?.priceUsd) {
        return Response.json({ price: Number.parseFloat(pair.priceUsd).toFixed(2) })
      }
    }

    // Return default if both fail
    return Response.json({ price: "0.9" })
  } catch (error) {
    console.error("Error fetching token price:", error)
    return Response.json({ price: "0.9" })
  }
}
