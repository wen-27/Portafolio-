"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Globe } from "lucide-react"
import { NavbarLogo } from "@/components/logo-intro"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"

interface NavbarProps {
  visible: boolean
}

export default function Navbar({ visible }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { label: t.nav.work, href: "#trabajo" },
    { label: t.nav.about, href: "#sobre-mi" },
    { label: t.nav.contact, href: "#contacto" },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center px-8 py-5 bg-background/75 backdrop-blur-xl border-b border-border/60"
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Logo - positioned absolute left */}
      <motion.a
        href="#"
        className="absolute left-8 flex items-center gap-2 group"
        aria-label="Inicio"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <NavbarLogo />
        <span className="font-sans font-light tracking-widest text-sm uppercase text-primary">
          W
        </span>
      </motion.a>

      {/* Nav links - centered */}
      <nav aria-label="Navegacion principal">
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
            >
              <a
                href={link.href}
                className="font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-200 text-muted-foreground hover:text-accent"
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Right side: Language toggle + Theme toggle + CTA */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        {mounted && (
          <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border/60 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 font-mono text-xs tracking-wider"
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={language === "es" ? "Switch to English" : "Cambiar a Espanol"}
          >
            <Globe size={14} />
            {t.language.toggle}
          </motion.button>
        )}

        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full border border-border/60 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        )}

        {/* CTA */}
        <motion.a
          href="#contacto"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 font-mono text-xs tracking-[0.15em] uppercase rounded-full transition-all duration-300 border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 hover:border-primary"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          {t.nav.letsTalk}
        </motion.a>
      </div>
    </motion.header>
  )
}
