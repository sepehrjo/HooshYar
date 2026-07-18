import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SnapPanel({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex min-h-dvh snap-start snap-always flex-col justify-center",
        className,
      )}
    >
      {children}
    </section>
  );
}
