"use client";

import { motion } from "framer-motion";
import { XLogo, LinkedinLogo, GithubLogo, DiscordLogo, ArrowRight } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";
import { staggerContainer, staggerItem } from "@/components/motion/Reveal";

const socials = [
  { icon: XLogo, label: "X", href: "#" },
  { icon: LinkedinLogo, label: "LinkedIn", href: "#" },
  { icon: GithubLogo, label: "GitHub", href: "#" },
  { icon: DiscordLogo, label: "Discord", href: "#" },
];

const nav = ["Curriculum", "Playgrounds", "Tools", "Pricing", "About"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-soft px-5 pt-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="relative z-10 mx-auto grid max-w-6xl items-start gap-14 md:grid-cols-[1fr_auto_1fr]"
      >
        {/* left: brand, socials, contact */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-lg font-bold tracking-tight">Gradient</span>
          </div>

          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition-colors hover:border-coral/60 hover:text-text"
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>

          <a
            href="mailto:hmahmood19662004@gmail.com"
            className="mt-7 block font-display text-xl font-semibold transition-colors hover:text-coral"
          >
            hmahmood19662004@gmail.com
          </a>
          <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
            A2-201
            <br />
            Pak-Austria Fachhochschule
            <br />
            Haripur, Pakistan
          </address>
        </motion.div>

        {/* center: bracketed CTA */}
        <motion.div variants={staggerItem} className="flex justify-center">
          <div className="relative flex items-center justify-center py-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:12px_12px] [mask-image:radial-gradient(ellipse_55%_100%_at_50%_50%,transparent,black_72%)]"
            />
            <Bracket dir="left" />
            <span className="hidden h-px w-7 bg-border md:block" />
            <a
              href="#top"
              className="relative z-10 flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-coral/60"
            >
              Get a demo
              <span className="rounded-md bg-coral px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wide text-bg">
                Free
              </span>
            </a>
            <span className="hidden h-px w-7 bg-border md:block" />
            <Bracket dir="right" />
          </div>
        </motion.div>

        {/* right: nav links */}
        <motion.nav variants={staggerItem} className="flex flex-col gap-3 md:items-end md:text-right">
          {nav.map((item) => (
            <a
              key={item}
              href="#"
              className="font-display text-2xl font-semibold text-muted transition-colors hover:text-text"
            >
              {item}
            </a>
          ))}
        </motion.nav>
      </motion.div>

      {/* legal row */}
      <div className="relative z-10 mx-auto mt-16 flex max-w-6xl flex-col items-center gap-3 border-t border-border-soft py-6 text-sm text-faint sm:flex-row sm:justify-between">
        <a href="#" className="underline-offset-4 transition-colors hover:text-text hover:underline">
          Terms &amp; conditions
        </a>
        <span>© {new Date().getFullYear()} Gradient Labs. All rights reserved.</span>
        <a href="#" className="underline-offset-4 transition-colors hover:text-text hover:underline">
          Privacy policy
        </a>
      </div>

      {/* oversized brand watermark */}
      <div aria-hidden className="pointer-events-none relative select-none">
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display block translate-y-[18%] text-center font-extrabold leading-[0.75] tracking-tight text-surface-2 [font-size:clamp(4rem,23vw,21rem)]"
        >
          Gradient
        </motion.span>
      </div>
    </footer>
  );
}

function Bracket({ dir }: { dir: "left" | "right" }) {
  const side = dir === "left" ? "left-0" : "right-0";
  return (
    <div className="relative hidden h-24 w-5 md:block">
      <span className={`absolute inset-y-0 ${side} w-px bg-border`} />
      <span className={`absolute top-0 ${side} h-px w-5 bg-border`} />
      <span className={`absolute bottom-0 ${side} h-px w-5 bg-border`} />
    </div>
  );
}
