import React from "react";

interface RobotSparkIconProps extends React.ComponentPropsWithoutRef<"span"> {
  size?: number | string;
}

export function RobotSparkIcon({ className = "", size, style, ...props }: RobotSparkIconProps) {
  const customStyle: React.CSSProperties = {
    display: "inline-block",
    maskImage: "url('/images/icons8-ai-claude-hand-drawn-96.png')",
    WebkitMaskImage: "url('/images/icons8-ai-claude-hand-drawn-96.png')",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    backgroundColor: "currentColor",
    scale: "1.25", // Compensate for built-in PNG image padding to match Lucide's visual size
    transformOrigin: "center",
    ...style,
    ...(size ? { width: size, height: size } : {}),
  };

  return <span className={`shrink-0 ${className}`} style={customStyle} {...props} />;
}
