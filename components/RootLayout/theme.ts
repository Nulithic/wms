"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f48020",
    },
  },
  typography: {
    fontFamily: '"GothamBold", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Rounded corners for buttons
          fontWeight: 700,
          fontSize: "15px",
          textTransform: "capitalize",
        },
        contained: {
          color: "#fff",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#000",
          background: "#fff",
          boxShadow: "0px 0px 6px rgba(0, 0, 0, .3)",
          "@media (min-width: 600px)": {
            minHeight: "56px ",
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "56px",
          "@media (min-width: 600px)": {
            minHeight: "56px",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          minHeight: "56px",
          "@media (min-width: 600px)": {
            minHeight: "56px",
          },
        },
      },
    },
  },
});

export default theme;
