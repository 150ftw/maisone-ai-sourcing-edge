import logo from "@/assets/maisone-logo.png";
import { useTheme } from "@/components/theme-provider";

export function Logo({ className = "h-9 w-9", showText = true }: { className?: string; showText?: boolean }) {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Maisone Global"
        className={className}
        style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
      />
      {showText && (
        <span className="text-sm font-medium tracking-[0.3em] uppercase">Maisone</span>
      )}
    </div>
  );
}
