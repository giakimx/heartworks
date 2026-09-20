import { HeartIcon } from "@/components/icons";

export default function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <HeartIcon size={size} className="text-accent" />
      <div
        className="font-display tracking-[-0.2px]"
        style={{ fontSize: size }}
      >
        heartworks
      </div>
    </div>
  );
}
