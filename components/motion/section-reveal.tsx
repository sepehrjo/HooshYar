"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionReveal({
  className,
  children,
  transition,
  ...props
}: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={transition ?? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("motion-reduce:transform-none", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
