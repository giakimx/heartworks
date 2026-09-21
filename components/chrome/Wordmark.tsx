// The heartworks mark: just the handshake-heart icon
// (public/images/logo-icon.svg, 90×80), rendered in ink via a CSS mask —
// the source SVG is drawn in white.

const ICON_RATIO = 90 / 80;

export default function Wordmark({ size = 20 }: { size?: number }) {
  const height = Math.round(size * 1.2); // icon-only reads smaller than the old lockup
  const mask: React.CSSProperties = {
    width: Math.round(height * ICON_RATIO),
    height,
    WebkitMaskImage: "url(/images/logo-icon.svg)",
    maskImage: "url(/images/logo-icon.svg)",
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
