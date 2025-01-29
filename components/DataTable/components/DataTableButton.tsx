import { Button, type ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const DataTableButton = styled(Button)<ButtonProps>(({ theme, color = "primary" }) => ({
  backgroundColor: "#f9f9f9",
  height: "26px",
  fontSize: "12px",
  border: `1px solid ${theme.palette.divider}`,
  color: color === "error" ? theme.palette.error.main : theme.palette.text.primary,
  textTransform: "capitalize",
  minWidth: "auto",
  padding: "4px 12px",
  "&:hover": {
    backgroundColor: "#fff",
    border: `1px solid ${color === "error" ? theme.palette.error.main : theme.palette.divider}`,
  },
}));
