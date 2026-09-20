import seedJson from "@/seed/seed.json";
import type { DemoData } from "./types";

// Deep clone on every call so a reset can never be polluted by prior
// mutation of the module-level import.
export function seedState(): DemoData {
  return structuredClone(seedJson) as unknown as DemoData;
}
