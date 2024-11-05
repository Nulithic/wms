"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  Person as UserManagementIcon,
  Group as GroupManagementIcon,
  Menu as ApplicationMenusIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface SettingCard {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const settingsGroups = {
  Permissions: [
    { title: "User Management", icon: <UserManagementIcon />, path: "/settings/users" },
    { title: "Group Management", icon: <GroupManagementIcon />, path: "/settings/groups" },
    { title: "Application Menus", icon: <ApplicationMenusIcon />, path: "/settings/menus" },
    // { title: "Application Settings", icon: <ApplicationSettingsIcon />, path: "/settings/application" },
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
  return (
    <Box sx={{ p: 3 }}>
      {Object.entries(settingsGroups).map(([groupTitle, settings]) => (
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
      ))}
    </Box>
  );
}
