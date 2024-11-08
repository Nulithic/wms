/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, FormEvent } from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { login } from "./actions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://splgroup.com/">
        SPL Group
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await login(formData);
      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      height="100vh"
      sx={{
        backgroundImage: "url(login_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid container alignContent="center" justifyContent="center">
        <CssBaseline />
        <Grid item component={Paper} elevation={1} p={5} textAlign="center" square>
          <img src="/splgroup_logo.png" alt="splgroup" height={100} />
          <div>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email"
                id="email"
                name="email"
                type="email"
                autoFocus
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ my: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Forgot Password?"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
