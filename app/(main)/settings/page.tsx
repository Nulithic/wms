"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  Person as UserManagementIcon,
  Group as GroupManagementIcon,
  Menu as ApplicationMenusIcon,
  AccountCircle as ProfileIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/libs/hooks/useAuthorization";

interface SettingCard {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const settingsGroups = {
  Account: [
    { title: "Profile Settings", icon: <ProfileIcon />, path: "/settings/profile" },
    { title: "Notifications", icon: <NotificationsIcon />, path: "/settings/notifications" },
    { title: "Theme", icon: <ThemeIcon />, path: "/settings/theme" },
  ],
  Permissions: [
    { title: "User Management", icon: <UserManagementIcon />, path: "/admin/users" },
    { title: "Group Management", icon: <GroupManagementIcon />, path: "/admin/groups" },
    { title: "Application Menus", icon: <ApplicationMenusIcon />, path: "/admin/menu-items" },
  ],
};

const SettingCard = ({ title, icon, path }: SettingCard) => {
  const router = useRouter();

  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={() => router.push(path)}
    >
      <Box sx={{ mb: 1, color: "primary.main" }}>{icon}</Box>
      <Typography variant="subtitle1" align="center">
        {title}
      </Typography>
    </Paper>
  );
};

export default function SettingsPage() {
  const { isAdmin, isLoading } = useAuthorization();

  if (isLoading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {Object.entries(settingsGroups).map(([groupTitle, settings]) => {
        // Skip the Permissions group for non-admin users
        if (groupTitle === "Permissions" && !isAdmin) {
          return null;
        }

        return (
          <Box key={groupTitle} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {groupTitle}
            </Typography>
            <Grid container spacing={3}>
              {settings.map((setting) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={setting.title}>
                  <SettingCard {...setting} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}
