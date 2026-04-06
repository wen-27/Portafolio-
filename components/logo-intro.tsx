"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"

interface LogoIntroProps {
  onComplete: () => void
}

// Floating particle component
function Particle({ delay }: { delay: number }) {
  const randomX = Math.random() * 100
  const randomSize = 2 + Math.random() * 3
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${randomX}%`,
        bottom: "-10px",
        width: randomSize,
        height: randomSize,
        background: `radial-gradient(circle, oklch(0.88 0.08 350 / 0.9), oklch(0.72 0.18 350 / 0.4))`,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, -(200 + Math.random() * 300)],
        opacity: [0, 0.8, 0],
        x: [(Math.random() - 0.5) * 40],
      }}
      transition={{
        delay,
        duration: 3 + Math.random() * 2,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  )
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<"intro" | "exit">("intro")
  const controls = useAnimation()

  // The W path — elegant, slightly serif-style with fine strokes
  // ViewBox 0 0 200 200
  const wPath =
    "M 20 30 L 55 160 L 100 80 L 145 160 L 180 30"

  // Length of the W path for strokeDasharray
  const pathLength = 520

  useEffect(() => {
    // Phase timeline:
    // 0.0s — appear
    // 0.4s — draw stroke
    // 1.6s — fill + glow
    // 2.4s — pulse
    // 3.0s — exit fade

    const timer = setTimeout(() => {
      setPhase("exit")
      setTimeout(onComplete, 900)
    }, 3200)

    return () => clearTimeout(timer)
  }, [onComplete])

  const particles = Array.from({ length: 16 }, (_, i) => i)

  return (
    <AnimatePresence>
      {phase === "intro" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.14 0.015 330 / 1), oklch(0.09 0.005 300 / 1))",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background soft glow blob */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 480,
              height: 480,
              background:
                "radial-gradient(circle, oklch(0.72 0.18 350 / 0.12), transparent 70%)",
              filter: "blur(60px)",
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.1, 1], opacity: [0, 0.7, 0.5] }}
            transition={{ delay: 0.3, duration: 1.8, ease: "easeOut" }}
          />

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((i) => (
              <Particle key={i} delay={0.6 + i * 0.15} />
            ))}
          </div>

          {/* Logo container */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.85, 1.04, 1], opacity: 1 }}
            transition={{
              delay: 0.15,
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 260,
                height: 260,
                background: "transparent",
                boxShadow: "0 0 80px 20px oklch(0.72 0.18 350 / 0.18)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6] }}
              transition={{ delay: 1.4, duration: 1.2 }}
            />

            {/* The SVG W */}
            <svg
              viewBox="0 0 200 200"
              width={200}
              height={200}
              fill="none"
              aria-label="Logo W"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Pink gradient fill */}
                <linearGradient id="wGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.88 0.08 350)" />
                  <stop offset="45%" stopColor="oklch(0.72 0.18 350)" />
                  <stop offset="100%" stopColor="oklch(0.56 0.22 350)" />
                </linearGradient>

                {/* Glow filter */}
                <filter id="wGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Stronger glow */}
                <filter id="wGlowStrong" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Shadow/depth stroke layer */}
              <motion.path
                d={wPath}
                stroke="oklch(0.56 0.22 350 / 0.3)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#wGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Main stroke — drawn with dasharray */}
              <motion.path
                d={wPath}
                stroke="url(#wGradient)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#wGlowStrong)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Highlight stroke — bright thin line on top */}
              <motion.path
                d={wPath}
                stroke="oklch(0.97 0.04 350 / 0.7)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.9, 0.5] }}
                transition={{ delay: 0.55, duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Pulse / glow layer — appears after stroke draw */}
              <motion.path
                d={wPath}
                stroke="oklch(0.72 0.18 350 / 0.5)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#wGlowStrong)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.2, 0.5, 0] }}
                transition={{
                  delay: 1.6,
                  duration: 1.4,
                  times: [0, 0.2, 0.5, 0.7, 1],
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>

          {/* Tagline — appears below after draw */}
          <motion.p
            className="absolute font-mono tracking-[0.35em] text-xs uppercase"
            style={{ bottom: "calc(50% - 140px)", color: "oklch(0.72 0.18 350 / 0.7)" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6, ease: "easeOut" }}
          >
            Portafolio
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Small navbar logo (used after intro exits)
export function NavbarLogo() {
  return (
    <svg
      viewBox="0 0 200 200"
      width={36}
      height={36}
      fill="none"
      aria-label="W logo"
      style={{ overflow: "visible" }}
      className="text-primary"
    >
      <defs>
        <linearGradient id="wNavGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--pink-soft)" />
          <stop offset="100%" stopColor="var(--pink-deep)" />
        </linearGradient>
        <filter id="wNavGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 20 30 L 55 160 L 100 80 L 145 160 L 180 30"
        stroke="url(#wNavGrad)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#wNavGlow)"
      />
    </svg>
  )
}
