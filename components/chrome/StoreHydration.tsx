"use client";

import { useEffect } from "react";
import { useDemoStore } from "@/lib/store";

// Rehydrates the persisted store exactly once per full page load, after
// React hydration is complete (the store uses skipHydration).
export default function StoreHydration() {
  useEffect(() => {
    useDemoStore.persist.rehydrate();
  }, []);
  return null;
}
