"use client";

import { useParams } from "next/navigation";
import { useGroups } from "@/libs/api/queries/admin/groupsQueries";
import UsersTable from "./UsersTable";
import MenuItemGroupsTable from "./MenuTable";
import { Box, Typography, Divider } from "@mui/material";

export default function GroupPage() {
  const { id } = useParams();
  const { getGroup } = useGroups();
  const { data: group, isLoading, isError } = getGroup(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching group</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Group Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
          <p>{group.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p>{group.name}</p>
        </div>
      </div>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Users in Group
        </Typography>
        <UsersTable groupId={group.id} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Menu Item Groups
        </Typography>
        <MenuItemGroupsTable groupId={group.id} />
      </Box>
    </div>
  );
}
