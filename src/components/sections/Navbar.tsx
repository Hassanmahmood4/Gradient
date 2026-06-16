"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { Show, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { navLinks as links } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "mx-3 border border-border-soft bg-surface/70 backdrop-blur-xl sm:mx-auto"
            : "border border-transparent",
        )}
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="Gradient home">
          <Logo className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight">Gradient</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/learn">
              <Button variant="ghost" size="md">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Button size="md" onClick={() => router.push("/learn")}>
            Start learning
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-text md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-2 flex flex-col gap-1 rounded-3xl border border-border-soft bg-surface/90 p-3 backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              {l.label}
            </a>
          ))}
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/learn">
              <Button
                variant="ghost"
                className="mt-1 w-full"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Button
            className="mt-1 w-full"
            onClick={() => {
              setOpen(false);
              router.push("/learn");
            }}
          >
            Start learning
          </Button>
        </motion.nav>
      )}
    </motion.header>
  );
}
