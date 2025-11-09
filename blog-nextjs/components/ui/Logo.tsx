// ============================================================================
// Logo Component - Unified Logo Display
// ============================================================================

import siteConfig from "@/lib/constants/siteConfig";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
};

export default function Logo({ size = "sm", className, showText = false }: LogoProps) {
  const { logo } = siteConfig;

  // 根据配置生成渐变类，默认使用蓝白渐变
  const gradientClass = logo.gradient.from === "google-blue" && logo.gradient.to === "white"
    ? "bg-gradient-to-br from-google-blue to-white"
    : `bg-gradient-to-br from-${logo.gradient.from} to-${logo.gradient.to}`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon/Image */}
      <div
        className={cn(
          "rounded-lg flex items-center justify-center text-white font-bold",
          gradientClass,
          sizeClasses[size],
        )}
      >
        {logo.imageUrl ? (
          <Image
            src={logo.imageUrl}
            alt={siteConfig.name}
            width={size === "xl" ? 64 : size === "lg" ? 48 : size === "md" ? 40 : 32}
            height={size === "xl" ? 64 : size === "lg" ? 48 : size === "md" ? 40 : 32}
            className="rounded-lg object-cover"
          />
        ) : (
          <span>{logo.text}</span>
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={cn(
          "font-semibold text-foreground",
          size === "xl" ? "text-2xl" : size === "lg" ? "text-xl" : size === "md" ? "text-lg" : "text-base"
        )}>
          {siteConfig.name}
        </span>
      )}
    </div>
  );
}
