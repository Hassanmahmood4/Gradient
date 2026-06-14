"use client";

import { labs } from "@/components/learn/labs";
import type { LabKey } from "@/lib/curriculum";

/** Bridges a server page to the client lab registry by key. */
export function LabMount({ labKey }: { labKey: LabKey }) {
  const Lab = labs[labKey];
  if (!Lab) return null;
  return <Lab />;
}
