import { Sparkles } from "lucide-react";

export function AiOrb() {
  return (
    <div className="relative grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
      <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-50 blur-3xl" />
      <div
        className="absolute inset-10 rounded-full border border-white/10"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--brand-3) 70%, transparent), transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full border border-dashed border-brand/40 animate-spin"
        style={{ animationDuration: "20s" }}
      />
      <div
        className="absolute inset-8 rounded-full border border-brand-2/30 animate-spin"
        style={{ animationDuration: "13s", animationDirection: "reverse" }}
      />
      <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-brand text-white shadow-[var(--glow)]">
        <Sparkles size={34} />
      </div>
    </div>
  );
}
