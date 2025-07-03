import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4", className)}>
      {children}
    </div>
  );
};

export default Container;