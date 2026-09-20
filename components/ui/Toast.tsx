"use client";

import { useEffect, useState } from "react";

type Listener = (message: string) => void;
const listeners = new Set<Listener>();

export function toast(message: string) {
  listeners.forEach((l) => l(message));
}

export default function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const listener: Listener = (m) => {
      setMessage(m);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2200);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      clearTimeout(timer);
    };
  }, []);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-pill"
    >
      {message}
    </div>
  );
}
