import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-lg px-2 py-1 text-secondary hover:bg-muted hover:text-foreground"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5" />
      ) : (
        <FiMoon className="h-5 w-5" />
      )}
    </button>
  );
}
