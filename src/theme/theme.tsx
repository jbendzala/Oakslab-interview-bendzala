import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ba4611",
    },
    secondary: {
      main: "#fcf4ee",
      light: "#ffffff",
      dark: "#f7c306",
    },
    text: {
      primary: "#1D1A05",
      secondary: "#74685b",
    },
  },
  typography: {
    fontFamily: ["'Poppins', sans-serif"].join(","),
  },
});

export default theme;
