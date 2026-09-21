/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: ["class"],
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        3: "3px",
      },
      colors: {
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        background: "hsl(var(--background))",
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        foreground: "hsl(var(--foreground))",
        input: "hsl(var(--input))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: "#6366f1",
        ring: "hsl(var(--ring))",
      },
      height: {
        3.5: "0.875rem",
        5.5: "1.375rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        112: "28rem",
        120: "30rem",
        152: "38rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      padding: {
        0.8: "0.2rem",
      },
      screens: {
        "2xl": "1536px",
        dic3: "1100px",
        dic4: "1440px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xl: "1280px",
      },
      transitionDuration: {
        0: "0ms",
      },
      width: {
        3.5: "0.875rem",
        5.5: "1.375rem",
        15: "3.75rem",
        18: "4.5rem",
        70: "17.5rem",
        75: "18.75rem",
        84: "21rem",
        85: "21.25rem",
        100: "25rem",
        116: "29rem",
        150: "37.5rem",
        160: "40rem",
        200: "50rem",
      },
    },
  },
  variants: {
    extend: {
      backgroundOpacity: ["dark"],
      textOpacity: ["dark"],
      visibility: ["hover", "group-hover"],
    },
  },
};
