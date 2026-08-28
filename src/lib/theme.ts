import { useEffect, useState } from "react";

export type Theme = "dark" | "light";
const KEY = "qla-theme";

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(KEY) === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = readTheme();
    applyTheme(t);
    setTheme(t);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(KEY, next);
    applyTheme(next);
    setTheme(next);
  }

  return { theme, toggle };
}
