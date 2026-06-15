"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";
import { Sidebar } from "@/components/learn/Sidebar";
import { AuthControls } from "@/components/learn/AuthControls";
import { PointsBadge } from "@/components/learn/PointsBadge";
import { ProgressSync } from "@/components/learn/ProgressSync";
import { cn } from "@/lib/utils";

export function Workspace({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <ProgressSync />
        {/* top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border-soft bg-bg/80 px-4 backdrop-blur">
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-text lg:hidden"
            aria-label="Toggle topics"
          >
            {open ? <X size={18} /> : <List size={18} />}
          </button>
          <Link href="/" className="flex items-center gap-2" aria-label="Gradient home">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-semibold">Gradient</span>
          </Link>
          <span className="hidden font-mono text-xs text-faint sm:inline">
            / learn
          </span>
          <div className="ml-auto flex items-center gap-3">
            <PointsBadge />
            <AuthControls />
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl">
          {/* sidebar — drawer on mobile, sticky column on desktop */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 top-14 z-30 w-72 border-r border-border-soft bg-surface/95 backdrop-blur transition-transform lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:bg-transparent lg:backdrop-blur-none",
              open ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>

          {/* backdrop on mobile */}
          {open ? (
            <div
              className="fixed inset-0 top-14 z-20 bg-black/50 lg:hidden"
              onClick={() => setOpen(false)}
            />
          ) : null}

          <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
            {children}
          </main>
        </div>
      </div>
  );
}
