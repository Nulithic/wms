/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";

interface StyledDrawerHeaderProps {
  open?: boolean;
}

const StyledDrawerHeader = styled("div")<StyledDrawerHeaderProps>(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  height: 56,
  minHeight: "56px",
  "@media (min-width: 600px)": {
    minHeight: "56px",
  },
  boxShadow: open ? "3px 0px 6px rgba(0, 0, 0, .3)" : "none",
}));

const StyledImage = styled("img")(({ theme }) => ({
  height: "70%",
  width: "auto",
  objectFit: "contain",
  margin: "0 auto",
  display: "block",
  "@media (min-width: 600px)": {
    height: "70%",
  },
}));

interface DrawerHeaderProps {
  open?: boolean;
}

const DrawerHeader = ({ open }: DrawerHeaderProps) => {
  const router = useRouter();

  const handleNav = () => () => {
    router.push("/");
  };

  return (
    <StyledDrawerHeader open={open}>
      <StyledImage
        src="/splgroup_logo.png"
        alt="SPL Group"
        // onClick={handleNav()}
      />
    </StyledDrawerHeader>
  );
};

export default DrawerHeader;
