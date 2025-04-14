/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        destaque: "#33C1DB",
        primaria: "#0082BA",
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
        d_medio3: "#63BDD1",
        aviso: "#ffd200",
      },
      boxShadow: {
        default: "0px 4px 4px rgba(0, 0, 0, 0.2)",
        buttom: "0 1px 3px 1px rbg(0,0,0,0.15)",
        innerShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        dropShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
      },
      dropShadow: {
        addShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        saveShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
        monthsShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        lastMonthShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        editShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        loginShadow: "9px 9px 2px rgba(0, 0, 0, 0.30)",
        topbatShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      letterSpacing: {
        normal: "0.25px",
      },
      fontSize: {
        F8: "8px",
        F9: "9px",
        F10: "10px",
        F15: "15px",
        F17: "17px",
        F20: "20px",
        F21: "21px",
        F25: "25px",
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        openSans: ["Open_sans-regular", "helvetica"],
      },
      borderRadius: {
        B10: "10px",
        B15: "15px",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1100px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
