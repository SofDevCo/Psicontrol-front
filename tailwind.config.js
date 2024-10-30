/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        destaque: "#33C1DB",
        primaria: "#0082BA",
        "custom-white": "#DFEAF2",
        "custom-gray": "#8BA3CB",
        bg1: "#F5F5F5",
        bg2: "#E6EFF5",
        bgM: "#33B8D1",
        clara4: "#EDF5FC",
        clara3: "#C7E0F7",
        cinza6: "#81A0AE",
        cinza8: "#B6CAD3",
        cinza9: "#D2DFE5",
        texto1: "#232323",
        texto2: "#5C5C5C",
        texto3: "#808080",
        texto4: "#F5F5F5",
        d_medio3: "#63BDD1"
      },
      boxShadow: {
        default: "0px 4px 4px rgba(0, 0, 0, 0.2)",
        innerShadow:"inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        dropShadow:"0px 4px 4px rgba(0, 0, 0, 0.2)",
      },
      dropShadow: {
        addShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        saveShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
        monthsShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        lastMonthShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      letterSpacing: {
        normal: "0.25px",
      },
      fontSize: {
        F15: "15px",
        F20: "20px",
        F25: "25px",

      },
    },
  },
  plugins: [],
};
