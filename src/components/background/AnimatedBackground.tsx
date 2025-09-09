import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default memo(function AnimatedBackground() {
  const reduce = useReducedMotion();

  // A layered, subtle gradient stack using our exact brand colors
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 0,                  // content must sit above (zIndex > 0)
    pointerEvents: "none",
    backgroundColor: "#040304", // guarantee base contrast
    // GPU hint for smoother transforms
    willChange: "transform, opacity",
    // Prevent mobile address bar jumps
    height: "100dvh",
    width: "100vw",
  };

  const layer = {
    background: `
      radial-gradient(50% 40% at 50% 35%, rgba(210,182,161,0.14) 0%, transparent 60%),
      radial-gradient(35% 30% at 75% 65%, rgba(239,210,188,0.10) 0%, transparent 70%),
      conic-gradient(from 0deg at 50% 50%,
        rgba(210,182,161,0.10),
        rgba(220,162,147,0.06),
        rgba(239,210,188,0.08),
        rgba(210,182,161,0.10)
      )
    `,
    // Soft mask to keep edges dark and readable
    maskImage: "radial-gradient(120% 120% at 50% 40%, black 40%, transparent 100%)",
    WebkitMaskImage: "radial-gradient(120% 120% at 50% 40%, black 40%, transparent 100%)",
  } as React.CSSProperties;

  const anim = reduce
    ? { opacity: 0.85, rotate: 0, scale: 1 }    // static for reduced motion users
    : { opacity: 0.9, rotate: 360, scale: 1.02 }; // ultra-slow sweep

  const transition = reduce
    ? { duration: 0 } 
    : { duration: 28, repeat: Infinity, ease: "linear" };

  return (
    <motion.div
      aria-hidden
      style={{ ...baseStyle, ...layer }}
      initial={{ opacity: 0, scale: 1 }}
      animate={anim}
      transition={transition}
    />
  );
});
