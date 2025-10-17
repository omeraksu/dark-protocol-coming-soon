"use client"

import { useEffect, useState } from "react"

export default function ComingSoon() {
  const [tokenPrice, setTokenPrice] = useState<string>("$0.9")

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const response = await fetch("/api/token-price")
        const data = await response.json()
        if (data.price) {
          setTokenPrice(`$${data.price}`)
        }
      } catch (error) {
        console.error("Failed to fetch token price:", error)
      }
    }

    fetchTokenPrice()
    // Refresh price every 5 minutes
    const interval = setInterval(fetchTokenPrice, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,1)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="3"
          strokeDasharray="200 3800"
          strokeDashoffset="4000"
          filter="url(#glow)"
          className="animate-border-flow-360"
          rx="0"
        />
      </svg>

      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 select-none">
          <img src="/dark-logo.svg" alt="Dark" className="h-8" draggable="false" />
          <span className="text-xs text-white/50 px-2 py-0.5 bg-white/5 rounded border border-white/10">
            coming back
          </span>
        </div>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm">
          <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Deposit
          </button>
          <button className="flex items-center gap-2 text-white/30 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01"
              />
            </svg>
            Swap
          </button>
          <button className="flex items-center gap-2 text-white/30 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 102 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            Earn
          </button>
        </nav>

        <div className="w-[100px]"></div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-light tracking-tight text-white">
              Dark Protocol
              <span className="block text-emerald-400">Returns</span>
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          </div>
          <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-jetbrains font-light">
            Dark is coming back online.
            <span className="block mt-2 text-white/70">Prepare for re-entry.</span>
          </p>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-6 py-8 relative z-10">
        <div className="flex items-center justify-center gap-8 text-sm text-white/40">
          <img src="/dark-logo.svg" alt="Dark" className="h-5 opacity-60 select-none" draggable="false" />
          <div className="h-4 w-px bg-white/20" />
          <a
            href="https://jup.ag/swap?sell=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&buy=FmQ7v2QUqXVVtAXkngBh3Mwx7s3mKT55nQ5Z673dURYS"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors cursor-pointer"
          >
            {tokenPrice}
          </a>
          <a
            href="https://x.com/privateLP"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            x.com
          </a>
          <a
            href="https://v2.realms.today/dao/EJ5vp5ivz4nKmuRqTYMDYMBBKGwrr5BG3w5hk7bMRAvB/proposals"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            governance
          </a>
          <a
            href="https://github.com/darkprotocolhq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            github
          </a>
        </div>
      </footer>
    </div>
  )
}
