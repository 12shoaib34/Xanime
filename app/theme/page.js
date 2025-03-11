"use client";
import React, { useEffect } from "react";

const themes = [
  {
    name: "Dark Red",
    background: "#212121",
    backgroundSecondary: "#171717",
    backgroundTertiary: "#2d2d2d",
    foreground: "#ffffff",
    foregroundSecondary: "#1c1c1c",
    foregroundTertiary: "#2d2d2d",
    primary: "#e53637",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#e53637",
  },
  {
    name: "Dark Blue",
    background: "#1b1b2f",
    backgroundSecondary: "#162447",
    backgroundTertiary: "#1f4068",
    foreground: "#ffffff",
    foregroundSecondary: "#1a1a2e",
    foregroundTertiary: "#0f3460",
    primary: "#0f4c75",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#0f4c75",
  },
  {
    name: "Dark Green",
    background: "#1e272e",
    backgroundSecondary: "#485460",
    backgroundTertiary: "#2d3436",
    foreground: "#ffffff",
    foregroundSecondary: "#2f3640",
    foregroundTertiary: "#4b6584",
    primary: "#2ed573",
    fontColorPrimary: "#000000",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#2ed573",
  },
  {
    name: "Dark Purple",
    background: "#2c2c54",
    backgroundSecondary: "#474787",
    backgroundTertiary: "#5f27cd",
    foreground: "#ffffff",
    foregroundSecondary: "#341f97",
    foregroundTertiary: "#833471",
    primary: "#8e44ad",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#8e44ad",
  },
  {
    name: "Dark Orange",
    background: "#2d3436",
    backgroundSecondary: "#636e72",
    backgroundTertiary: "#d35400",
    foreground: "#ffffff",
    foregroundSecondary: "#e67e22",
    foregroundTertiary: "#ff9f43",
    primary: "#d35400",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#d35400",
  },
  {
    name: "Dark Cyan",
    background: "#0f4c5c",
    backgroundSecondary: "#1a656c",
    backgroundTertiary: "#2a9d8f",
    foreground: "#ffffff",
    foregroundSecondary: "#264653",
    foregroundTertiary: "#00b4d8",
    primary: "#00b4d8",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#00b4d8",
  },
  {
    name: "Dark Teal",
    background: "#1b3a4b",
    backgroundSecondary: "#28527a",
    backgroundTertiary: "#344e41",
    foreground: "#ffffff",
    foregroundSecondary: "#2c6e49",
    foregroundTertiary: "#4a7c59",
    primary: "#57cc99",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#57cc99",
  },
  {
    name: "Dark Pink",
    background: "#3a1c71",
    backgroundSecondary: "#d76d77",
    backgroundTertiary: "#ffaf7b",
    foreground: "#ffffff",
    foregroundSecondary: "#6a0572",
    foregroundTertiary: "#b56576",
    primary: "#ff477e",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#ff477e",
  },
  {
    name: "Dark Yellow",
    background: "#3d3d29",
    backgroundSecondary: "#615d40",
    backgroundTertiary: "#9a8c42",
    foreground: "#ffffff",
    foregroundSecondary: "#7e733f",
    foregroundTertiary: "#b08968",
    primary: "#ffcc29",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#ffcc29",
  },
  {
    name: "Dark Magenta",
    background: "#4a148c",
    backgroundSecondary: "#6a1b9a",
    backgroundTertiary: "#8e24aa",
    foreground: "#ffffff",
    foregroundSecondary: "#7b1fa2",
    foregroundTertiary: "#9c27b0",
    primary: "#ba68c8",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#ba68c8",
  },
  {
    name: "Dark Black",
    background: "#000000",
    backgroundSecondary: "#121212",
    backgroundTertiary: "#1c1c1c",
    foreground: "#ffffff",
    foregroundSecondary: "#1a1a1a",
    foregroundTertiary: "#2a2a2a",
    primary: "#ff0000",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#ffffff",
    borderPrimary: "#ff0000",
  },
];

const Theme = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      applyTheme(theme);
    }
  }, []);

  const applyTheme = (theme) => {
    Object.keys(theme).forEach((key) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, theme[key]);
    });
    localStorage.setItem("theme", JSON.stringify(theme));
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background-secondary p-4 rounded-lg shadow-lg flex flex-wrap justify-center gap-3">
      {themes.map((theme, index) => (
        <button
          key={index}
          className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-all"
          style={{ backgroundColor: theme.primary }}
          onClick={() => applyTheme(theme)}
          title={theme.name}
        />
      ))}
    </div>
  );
};

export default Theme;
