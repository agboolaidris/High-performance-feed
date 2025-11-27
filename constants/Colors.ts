// constants/colors.ts (or .js)

export const COLORS = {
  // Black with 9 useful variants (perfect for backgrounds, text, borders, etc.)
  black: {
    100: "#E6E6E6",
    200: "#CCCCCC",
    300: "#B3B3B3",
    400: "#999999",
    500: "#808080", // main medium black
    600: "#666666",
    700: "#4D4D4D",
    800: "#333333",
    900: "#1A1A1A", // almost pure black
  },

  // Single solid colors
  white: "#ffffff",
  red: "#ED1010", // Apple-style red, or use '#ED1010' if you prefer Material
  green: "#0C9409", // Apple-style success green, or '#0C9409' for Material
} as const;
