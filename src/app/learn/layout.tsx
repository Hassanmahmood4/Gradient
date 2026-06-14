import type { Metadata } from "next";
import { Workspace } from "@/components/learn/Workspace";

export const metadata: Metadata = {
  title: "Learn — Gradient",
  description:
    "Interactive machine learning curriculum: read the concept, then play with the live lab.",
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Workspace>{children}</Workspace>;
}
