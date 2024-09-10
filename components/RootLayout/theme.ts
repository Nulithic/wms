"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Modern blue
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
          // textTransform: "none", // Disable uppercase transformation
        },
        // contained: {
        //   boxShadow: "none", // Remove default shadow
        //   "&:hover": {
        //     boxShadow: "none", // Remove shadow on hover
        //   },
        // },
      },
    },
    MuiAppBar: {
      // styleOverrides: {
      //   root: {
      //     boxShadow: "none", // Remove default shadow
      //   },
      // },
    },
  },
});

export default theme;
