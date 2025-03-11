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
  },
  {
    name: "Light Mode",
    background: "#f8f9fa",
    backgroundSecondary: "#e9ecef",
    backgroundTertiary: "#dee2e6",
    foreground: "#212529",
    foregroundSecondary: "#343a40",
    foregroundTertiary: "#495057",
    primary: "#007bff",
    fontColorPrimary: "#212529",
    fontColorSecondary: "#000000", // Updated this to white for better readability
  },
  {
    name: "Light Green",
    background: "#e8f5e9",
    backgroundSecondary: "#c8e6c9",
    backgroundTertiary: "#a5d6a7",
    foreground: "#212529",
    foregroundSecondary: "#388e3c",
    foregroundTertiary: "#4caf50",
    primary: "#4caf50",
    fontColorPrimary: "#212529",
    fontColorSecondary: "#000000",
  },
  {
    name: "Light Purple",
    background: "#ede7f6",
    backgroundSecondary: "#d1c4e9",
    backgroundTertiary: "#b39ddb",
    foreground: "#212529",
    foregroundSecondary: "#673ab7",
    foregroundTertiary: "#9575cd",
    primary: "#673ab7",
    fontColorPrimary: "#ffffff",
    fontColorSecondary: "#000000",
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
  },
  {
    name: "Light Orange",
    background: "#fff3e0",
    backgroundSecondary: "#ffe0b2",
    backgroundTertiary: "#ffcc80",
    foreground: "#212529",
    foregroundSecondary: "#fb8c00",
    foregroundTertiary: "#ff9800",
    primary: "#ff9800",
    fontColorPrimary: "#212529",
    fontColorSecondary: "#000000",
  },
  {
    name: "Light Blue",
    background: "#e3f2fd",
    backgroundSecondary: "#bbdefb",
    backgroundTertiary: "#90caf9",
    foreground: "#212529",
    foregroundSecondary: "#1976d2",
    foregroundTertiary: "#2196f3",
    primary: "#2196f3",
    fontColorPrimary: "#212529",
    fontColorSecondary: "#000000",
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
