/* eslint-disable @next/next/no-img-element */
import { styled } from "@mui/material/styles";

const StyledDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  height: 64,
}));

const DrawerHeader = () => {
  return (
    <StyledDrawerHeader>
      <img
        src="/splgroup_logo.png"
        alt="SPL Group"
        style={{
          height: "80%", // Set to a percentage of the DrawerHeader height
          width: "auto", // Maintain aspect ratio
          objectFit: "contain", // Ensure the entire logo is visible
          marginRight: "auto",
        }}
      />
    </StyledDrawerHeader>
  );
};

export default DrawerHeader;
