// The heartworks logo lockup (public/images/logo.svg, 627×85), rendered in
// ink via a CSS mask — the source SVG is drawn in white.

const LOGO_RATIO = 627 / 85;

export default function Wordmark({ size = 20 }: { size?: number }) {
  const mask: React.CSSProperties = {
    width: Math.round(size * LOGO_RATIO),
    height: size,
    WebkitMaskImage: "url(/images/logo.svg)",
    maskImage: "url(/images/logo.svg)",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
  return (
    <span
      role="img"
      aria-label="heartworks"
      className="inline-block bg-ink"
      style={mask}
    />
  );
}
