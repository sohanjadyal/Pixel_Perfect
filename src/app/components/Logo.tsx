import logoImg from "@/imports/a380a0_a6c11f05aa88455bb9879051dc494231_mv2-removebg-preview-2.png";
import markImg from "@/imports/IMG_9274.png";

interface LogoProps {
  className?: string;
  height?: number;
  /** Show only the B mark without the wordmark */
  markOnly?: boolean;
}

export function Logo({ className = "", height = 48, markOnly = false }: LogoProps) {
  if (markOnly) {
    return (
      <img
        src={markImg}
        alt="TurfBook"
        style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
        className={className}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ height: `${height}px` }}>
      {/* B mark — scales to match the wordmark height */}
      <img
        src={markImg}
        alt=""
        aria-hidden
        style={{ height: `${height}px`, width: "auto", objectFit: "contain", flexShrink: 0 }}
      />
    </div>
  );
}
