"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary:
    "flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white",
  secondary:
    "flex h-13 items-center justify-center gap-2 rounded-full border border-line-strong bg-card-soft text-[15px] font-semibold text-ink",
  text: "inline-flex items-center justify-center gap-1 text-[15px] font-semibold text-accent-ink",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={props.type ?? "button"}
      {...props}
      className={`${styles[variant]} ${props.disabled ? "opacity-50" : ""} ${className}`}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  variant?: Variant;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      // Routes are dynamic strings from store data; the typed-routes generic
      // can't see that, so we assert.
      href={href as never}
      {...props}
      className={`${styles[variant]} no-underline ${variant === "primary" ? "text-white" : "text-ink"} ${className}`}
    >
      {children}
    </Link>
  );
}
