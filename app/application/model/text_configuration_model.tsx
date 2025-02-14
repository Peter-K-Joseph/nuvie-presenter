export enum CurrentConfigurationOptions {
  ALIGNMENT = "alignment",
  COLOR = "color",
  BACKGROUND_COLOR = "backgroundColor",
  FONT_SIZE = "fontSize",
  FONT_WEIGHT = "fontWeight",
  FONT_FAMILY = "fontFamily",
  TEXT_STYLE = "textStyle",
}

export enum AlignmentOptions {
  LEFT = "Left",
  CENTER = "Center",
  RIGHT = "Right",
}

export enum FontFamilyOptions {
  ARIAL = "Arial",
  TIMES_NEW_ROMAN = "Times New Roman",
  COURIER_NEW = "Courier New",
  GEORGIA = "Georgia",
  VERDANA = "Verdana",
  JOSEFIN_SANS = "Josefin Sans",
}
// Define the structure of the configuration
export type CurrentConfiguration = {
  alignment: "left" | "center" | "right";
  color: { a: number; h: number; s: number; l: number } | null;
  backgroundColor: { a: number; h: number; s: number; l: number } | null;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
};

// Define the class with validation methods
export class CurrentConfigurationClass {
  alignment: "left" | "center" | "right" = "left";
  color: { a: number; h: number; s: number; l: number } | null = null;
  backgroundColor: { a: number; h: number; s: number; l: number } | null = null;
  fontSize: number = 16;
  fontWeight: number = 400;
  fontFamily: string = "JOSEFIN_SANS";
  italic: boolean = false;
  strikethrough: boolean = false;
  underline: boolean = false;

  loadFromObject(configuration: CurrentConfiguration) {
    this.alignment = configuration.alignment;
    this.color = configuration.color;
    this.backgroundColor = configuration.backgroundColor;
    this.fontSize = configuration.fontSize;
    this.fontWeight = configuration.fontWeight;
    this.fontFamily = configuration.fontFamily;
    this.italic = configuration.italic;
    this.strikethrough = configuration.strikethrough;
    this.underline = configuration.underline;

    return this;
  }

  // Validate and update the alignment
  setAlignment(value: "left" | "center" | "right") {
    if (!Object.keys(AlignmentOptions).includes(value)) {
      throw new Error("Invalid alignment value");
    }
    this.alignment = value;
  }

  // Validate and update the color
  setColor(value: { a: number; h: number; s: number; l: number } | null) {
    this.color = value === null || value.a === 0 ? null : value;
  }

  // Validate and update the background color
  setBackgroundColor(
    value: { a: number; h: number; s: number; l: number } | null,
  ) {
    this.backgroundColor = value === null || value.a === 0 ? null : value;
  }

  // Validate and update the font size
  setFontSize(value: number) {
    if (typeof value !== "number") {
      throw new Error("Invalid font size value");
    }
    this.fontSize = value;
  }

  // Validate and update the font weight
  setFontWeight(value: number) {
    if (typeof value !== "number") {
      throw new Error("Invalid font weight value");
    }
    this.fontWeight = value;
  }

  // Validate and update the font family
  setFontFamily(value: FontFamilyOptions) {
    if (!Object.keys(FontFamilyOptions).includes(value)) {
      throw new Error("Invalid font family value");
    }
    this.fontFamily = value;
  }

  setBold(value?: boolean | undefined) {
    if (value === undefined) {
      this.fontWeight = this.fontWeight >= 700 ? 400 : 700;

      return;
    }
    this.fontWeight = value ? 700 : 400;
  }

  setItalic(value?: boolean | undefined) {
    if (value === undefined) {
      this.italic = !this.italic;

      return;
    }
    this.italic = value;
  }

  setStrikethrough(value?: boolean | undefined) {
    if (value === undefined) {
      this.strikethrough = !this.strikethrough;

      return;
    }
    this.strikethrough = value;
  }

  setUnderline(value?: boolean | undefined) {
    if (value === undefined) {
      this.underline = !this.underline;

      return;
    }
    this.underline = value;
  }

  // Convert the class instance to a plain object
  toObject(): CurrentConfiguration {
    return {
      alignment: this.alignment,
      color: this.color,
      backgroundColor: this.backgroundColor,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontFamily: this.fontFamily,
      italic: this.italic,
      strikethrough: this.strikethrough,
      underline: this.underline,
    };
  }
}
