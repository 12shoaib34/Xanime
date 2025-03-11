"use client";

import React, { useEffect, useState } from "react";

const ThemeProvider = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = document.getElementById("loader");
    document.body.style.overflow = "hidden"; // Disable scrolling initially

    // LocalStorage se theme retrieve karke apply karna
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      Object.keys(theme).forEach((key) => {
        const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        document.documentElement.style.setProperty(cssVarName, theme[key]);
      });
    }

    if (loader) {
      loader.classList.add("opacity-100");

      setTimeout(() => {
        loader.classList.remove("opacity-100");
        loader.classList.add("opacity-0");

        setTimeout(() => {
          setLoading(false);
          document.body.style.overflow = "auto"; // Re-enable scrolling
        }, 1000); // Wait for transition
      }, 100);
    }
  }, []);

  return loading ? (
    <div
      id="loader"
      className="fixed z-50 w-full h-full bg-background top-0 left-0 transition-opacity duration-1000 opacity-100"
    ></div>
  ) : null;
};

export default ThemeProvider;
