import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: 3,
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Could not find requested resource
      </Typography>
      <Button component={Link} href="/" variant="contained" sx={{ mt: 2 }}>
        Return Home
      </Button>
    </Box>
  );
}
