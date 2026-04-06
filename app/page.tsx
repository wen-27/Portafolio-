"use client"

import { useState } from "react"
import LogoIntro from "@/components/logo-intro"
import Navbar from "@/components/navbar"
import PortfolioContent from "@/components/portfolio-content"

export default function Page() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <>
      {/* Logo intro overlay */}
      <LogoIntro onComplete={() => setIntroComplete(true)} />

      {/* Site shell — fades in after intro */}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <Navbar visible={introComplete} />
        <PortfolioContent />
      </div>
    </>
  )
}
