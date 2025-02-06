import React from "react";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export class ThemeController {
  theme: any;
  setTheme: any;

  constructor(theme: any, setTheme: any) {
    this.theme = theme;
    this.setTheme = setTheme;
  }
  toggle = () => {
    this.setTheme(this.theme === "dark" ? "light" : "dark");
  };

  isDark = () => {
    return this.theme === "dark";
  };

  icon = ({ size, className }: { size?: number; className?: string }) => {
    const iconSize = size ?? 22;

    return this.isDark() ? (
      <SunFilledIcon className={className} size={iconSize} />
    ) : (
      <MoonFilledIcon className={className} size={iconSize} />
    );
  };
}
