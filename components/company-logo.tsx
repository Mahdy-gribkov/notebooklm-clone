"use client";

import { useState, memo } from "react";

interface CompanyLogoProps {
  /** Domain like "wix.com" or full URL */
  domain?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-6 w-6 text-[9px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
} as const;

function extractDomain(input: string): string {
  try {
    const url = input.startsWith("http") ? input : `https://${input}`;
    return new URL(url).hostname;
  } catch {
    return input;
  }
}

function CompanyLogoInner({ domain, name, size = "md", className = "" }: CompanyLogoProps) {
  const [provider, setProvider] = useState<"clearbit" | "logodev" | "fallback">(
    domain ? "clearbit" : "fallback"
  );

  const sizeClass = SIZES[size];
  const host = domain ? extractDomain(domain) : "";

  if (provider === "fallback" || !host) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-primary/90 shadow-sm flex items-center justify-center text-primary-foreground font-bold ${className}`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  const src =
    provider === "clearbit"
      ? `https://logo.clearbit.com/${host}`
      : `https://img.logo.dev/${host}?token=pk_anonymous&size=64`;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={name}
      className={`${sizeClass} rounded-lg bg-white/90 p-0.5 shadow-sm ${className}`}
      loading="lazy"
      onError={() => {
        if (provider === "clearbit") {
          setProvider("logodev");
        } else {
          setProvider("fallback");
        }
      }}
    />
  );
}

export const CompanyLogo = memo(CompanyLogoInner);
