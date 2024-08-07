import { MenuItem } from "@mui/material";

const SignOutMenuItem = () => {
  return (
    <MenuItem>
      <form action="/signout" method="post">
        <button type="submit" style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" }}>
          Sign Out
        </button>
      </form>
    </MenuItem>
  );
};

export default SignOutMenuItem;
