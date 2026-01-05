"use client";

import { SessionProvider } from "next-auth/react";
import { PortfolioProvider } from "@/contexts/portfolio-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PortfolioProvider>{children}</PortfolioProvider>
    </SessionProvider>
  );
}