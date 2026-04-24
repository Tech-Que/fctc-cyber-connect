"use client";

import { useEffect } from "react";

export function PublicThemeDefault() {
  useEffect(() => {
    const stored = localStorage.getItem("fctc-theme");
    if (stored === null) {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return null;
}
