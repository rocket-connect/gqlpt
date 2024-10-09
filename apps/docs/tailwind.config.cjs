const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{jsx,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans],
        jakarta: ['"Plus Jakarta Sans"', ...fontFamily.sans],
        mono: ['"Fira Code"', ...fontFamily.mono],
      },
      borderRadius: {
        sm: "4px",
      },
      screens: {
        sm: "0px",
        lg: "997px",
      },
      colors: {
        ["graphql-otel-dark"]: "#221F20",
        ["graphql-otel-green"]: "#2F8525",
        ["graphiql-dark"]: "#202A3B",
        ["graphiql-medium"]: "#2D3648",
        ["graphiql-light"]: "#B7C2D7",
        ["graphiql-border"]: "#3B4355",
        ["graphiql-pink"]: "#FF5794",
        ["graphiql-highlight"]: "#444D60",
        ["editor-dark"]: "#1E1E1E",
      },
    },
  },
};
