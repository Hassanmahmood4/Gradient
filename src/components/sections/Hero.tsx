"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { HeroPeek } from "@/components/sections/HeroPeek";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
};

export function Hero() {
  const router = useRouter();
  return (
    <section
      id="top"
      className="grain relative overflow-hidden px-5 pb-0 pt-36 text-center sm:pt-44"
    >
      {/* backdrop */}
      <div className="grid-lines absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,black,transparent)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-4xl"
      >
        <motion.h1
          variants={item}
          className="font-display mx-auto max-w-3xl text-[length:var(--text-hero)] font-extrabold"
        >
          Learn machine learning by{" "}
          <span className="text-coral">seeing</span> it{" "}
          <span className="text-violet">move</span>.
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted"
        >
          Stop staring at static equations. Drag the data, tune the learning
          rate, and watch gradient descent, decision boundaries, and backprop
          respond in real time.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" onClick={() => router.push("/learn")}>
            Start learning free
            <ArrowRight size={18} weight="bold" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <PlayCircle size={20} />
            Watch the demo
          </Button>
        </motion.div>
      </motion.div>

      {/* product peek rising into view */}
      <HeroPeek />
    </section>
  );
}
