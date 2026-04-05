/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
      },
      screens: {
        xxsm: "332px",
        xsm: "432px",
        xlplus: "1400px",
      },
      colors: {
        travel: {
          primary: "#0EA5E9",
          secondary: "#06B6D4",
          accent: "#F59E0B",
          dark: "#0f172a",
          light: "#f1f5f9",
          success: "#10B981",
          ink: "#0f172a",
          muted: "#64748b",
          surface: "#f8fafc",
        },
      },
      boxShadow: {
        card:
          "0 4px 24px -4px rgba(15, 23, 42, 0.08), 0 8px 16px -8px rgba(15, 23, 42, 0.06)",
        "card-lg":
          "0 20px 50px -12px rgba(15, 23, 42, 0.12), 0 8px 24px -8px rgba(14, 165, 233, 0.08)",
        glow: "0 0 0 1px rgba(14, 165, 233, 0.12), 0 12px 40px -8px rgba(14, 165, 233, 0.2)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.1) 0px, transparent 45%), radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.06) 0px, transparent 40%)",
        "hero-shine":
          "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(14, 116, 144, 0.55) 45%, rgba(15, 23, 42, 0.88) 100%)",
      },
    },
  },
  plugins: [],
};
