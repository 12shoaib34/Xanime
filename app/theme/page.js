"use client";
import React, { useEffect } from "react";

const colors = [
  { bg: "#FF4F81", text: "#ffffff" }, // Rose Pink
  { bg: "#007BFF", text: "#ffffff" }, // Electric Blue
  { bg: "#00FF7F", text: "#000000" }, // Neon Green
  { bg: "#FFC107", text: "#000000" }, // Amber Yellow
  { bg: "#A855F7", text: "#ffffff" }, // Lavender
  { bg: "#00ADB5", text: "#ffffff" }, // Teal
  { bg: "#FF5722", text: "#ffffff" }, // Deep Orange
  { bg: "#673AB7", text: "#ffffff" }, // Deep Purple
  { bg: "#4CAF50", text: "#ffffff" }, // Green
  { bg: "#795548", text: "#ffffff" }, // Brown
];

const Theme = () => {
  useEffect(() => {
    const savedColor = localStorage.getItem("primaryColor");
    const savedTextColor = localStorage.getItem("fontColorPrimary");
    if (savedColor) {
      document.documentElement.style.setProperty("--primary", savedColor);
    }
    if (savedTextColor) {
      document.documentElement.style.setProperty("--font-color-primary", savedTextColor);
    }
  }, []);

  const changePrimaryColor = (color, textColor) => {
    document.documentElement.style.setProperty("--primary", color);
    document.documentElement.style.setProperty("--font-color-primary", textColor);
    localStorage.setItem("primaryColor", color);
    localStorage.setItem("fontColorPrimary", textColor);
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background-secondary p-4 rounded-lg shadow-lg flex gap-3">
      {colors.map((colorObj, index) => (
        <button
          key={index}
          className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition-all"
          style={{ backgroundColor: colorObj.bg }}
          onClick={() => changePrimaryColor(colorObj.bg, colorObj.text)}
        />
      ))}
    </div>
  );
};

export default Theme;
