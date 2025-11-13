"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Lock,
  Shuffle,
  Eye,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [tokenPrice, setTokenPrice] = useState<string>("$0.9");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    const interval = setInterval(fetchTokenPrice, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Private Deposits",
      subtitle: "Shield Your Assets",
      description:
        "Deposit SOL, USDC, or any SPL token into Dark Protocol. Your assets are cryptographically shielded using zero-knowledge proofs, making your balance invisible to the public.",
      steps: [
        "Connect wallet",
        "Select token & amount",
        "Generate ZK proof",
        "Assets now private",
      ],
    },
    {
      icon: Shuffle,
      title: "Anonymous Swaps",
      subtitle: "Trade Without Traces",
      description:
        "Swap between multiple tokens while maintaining complete privacy. All transactions happen within the shielded pool - no one can trace your trading activity.",
      steps: [
        "Choose tokens",
        "Enter swap amount",
        "Execute private swap",
        "Balances updated privately",
      ],
    },
    {
      icon: Lock,
      title: "Secure Withdrawals",
      subtitle: "Exit On Your Terms",
      description:
        "Withdraw your shielded assets to any address. The recipient has no way to know the source of funds, ensuring complete transaction privacy.",
      steps: [
        "Select token",
        "Enter destination",
        "Generate proof",
        "Receive clean funds",
      ],
    },
    {
      icon: Eye,
      title: "Zero Knowledge",
      subtitle: "Provably Private",
      description:
        "Powered by cutting-edge ZK-SNARK technology. Your transactions are mathematically proven valid without revealing any details about amounts, tokens, or participants.",
      steps: [
        "State-of-the-art cryptography",
        "No trusted setup required",
        "Verifiable on-chain",
        "Maximum privacy guaranteed",
      ],
    },
  ];

  return (
    <div className='relative min-h-screen bg-black text-white overflow-hidden flex flex-col'>
      <div
        className='fixed inset-0 pointer-events-none z-0 transition-opacity duration-300'
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      <div
        className='fixed inset-0 z-0 opacity-[0.02]'
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <svg
        className='fixed inset-0 w-full h-full pointer-events-none z-10'
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

      <header className='relative z-20 px-8 py-6 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-3'>
          <Image
            src='/dark-logo.svg'
            alt='Dark Protocol'
            width={32}
            height={32}
            className='select-none'
            draggable='false'
          />
          <span className='text-xs px-2 py-1 border border-white/20 rounded text-white/60'>
            ShadowDancer
          </span>
        </Link>

        <Link
          href='https://beta.darkprotocol.io'
          target='_blank'
          className='px-4 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors text-sm'>
          Launch App
        </Link>
      </header>

      <main className='relative z-20 flex-1 flex flex-col items-center justify-center px-8 pb-12'>
        <div className='text-center mb-16 max-w-3xl'>
          <h1 className='text-6xl md:text-7xl font-light mb-6 tracking-tight'>
            Dark Protocol
          </h1>
          <p className='text-xl md:text-2xl text-white/60 font-light font-jetbrains mb-8'>
            Private transactions on Solana.
            <br />
            <span className='text-emerald-400'>
              Zero knowledge. Maximum privacy.
            </span>
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className='group relative p-6 border border-white/10 hover:border-emerald-400/50 bg-black/40 backdrop-blur-sm transition-all duration-300'
                aria-label={`Learn about ${feature.title}`}>
                <Icon className='w-full h-8 mb-4 text-emerald-400' />
                <h3 className='text-lg font-medium mb-1'>{feature.title}</h3>
                <p className='text-sm text-white/50'>{feature.subtitle}</p>
                <div className='absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/5 transition-colors pointer-events-none' />
              </button>
            );
          })}
        </div>
      </main>

      {activeFeature !== null && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='relative w-full max-w-2xl bg-black border border-white/20 p-8'>
            <button
              onClick={() => setActiveFeature(null)}
              className='absolute top-4 right-4 p-2 hover:bg-white/5 transition-colors rounded'
              aria-label='Close'>
              <X className='w-5 h-5' />
            </button>

            <div className='mb-8'>
              {(() => {
                const Icon = features[activeFeature].icon;
                return <Icon className='w-12 h-12 text-emerald-400 mb-6' />;
              })()}
              <h2 className='text-3xl font-light mb-2'>
                {features[activeFeature].title}
              </h2>
              <p className='text-emerald-400 mb-6'>
                {features[activeFeature].subtitle}
              </p>
              <p className='text-white/70 leading-relaxed mb-8'>
                {features[activeFeature].description}
              </p>

              <div className='space-y-4'>
                <h3 className='text-sm uppercase tracking-wider text-white/50 mb-4'>
                  How It Works
                </h3>
                {features[activeFeature].steps.map((step, idx) => (
                  <div key={idx} className='flex items-center gap-4'>
                    <div className='flex-shrink-0 w-8 h-8 rounded-full border border-emerald-400/30 flex items-center justify-center text-sm text-emerald-400'>
                      {idx + 1}
                    </div>
                    <p className='text-white/70'>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex items-center justify-between pt-6 border-t border-white/10'>
              <button
                onClick={() =>
                  setActiveFeature((prev) =>
                    prev! > 0 ? prev! - 1 : features.length - 1
                  )
                }
                className='flex items-center gap-2 px-4 py-2 hover:bg-white/5 transition-colors rounded'>
                <ChevronLeft className='w-4 h-4' />
                <span className='text-sm'>Previous</span>
              </button>

              <div className='flex gap-2'>
                {features.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFeature(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === activeFeature ? "bg-emerald-400" : "bg-white/20"
                    }`}
                    aria-label={`Go to feature ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setActiveFeature((prev) =>
                    prev! < features.length - 1 ? prev! + 1 : 0
                  )
                }
                className='flex items-center gap-2 px-4 py-2 hover:bg-white/5 transition-colors rounded'>
                <span className='text-sm'>Next</span>
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className='relative z-20 max-w-7xl mx-auto w-full px-6 py-8'>
        <nav
          className='flex items-center justify-center gap-8 text-sm text-white/40'
          aria-label='Footer navigation'>
          <img
            src='/dark-logo.svg'
            alt=''
            className='h-5 opacity-60 select-none'
            draggable='false'
            aria-hidden='true'
          />
          <div className='h-4 w-px bg-white/20' aria-hidden='true' />
          <a
            href='https://jup.ag/swap?sell=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&buy=FmQ7v2QUqXVVtAXkngBh3Mwx7s3mKT55nQ5Z673dURYS'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors cursor-pointer'
            aria-label={`Token price: ${tokenPrice}`}>
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
            href='https://github.com/darkprotocolhq'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-white/60 transition-colors'>
            github
          </a>
          <a
            href='https://beta.darkprotocol.io'
            target='_blank'
            className='hover:text-white/60 transition-colors'>
            app
          </a>
        </nav>
      </footer>
    </div>
  );
}
