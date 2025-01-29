import { Button, type ButtonProps } from "@mui/material";

interface TableMenuButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const TableMenuButton = ({ children, ...props }: TableMenuButtonProps) => {
  return (
    <Button size="small" sx={{ textTransform: "none" }} {...props}>
      {children}
    </Button>
  );
};
