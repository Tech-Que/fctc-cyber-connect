"use client";

import { useEffect } from "react";

export function AppThemeDefault() {
  useEffect(() => {
    const stored = localStorage.getItem("fctc-theme");
    if (stored === null) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  return null;
}
