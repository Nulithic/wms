import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch } from "@mui/material";
import { useMenuItemGroups } from "@/libs/api/queries/admin/menuItemGroupQueries";
import { useGroups } from "@/libs/api/queries/admin/groupsQueries";

interface MenuItemGroupsTableProps {
  groupId: string;
}

export default function MenuItemGroupsTable({ groupId }: MenuItemGroupsTableProps) {
  const { getMenuItemGroups } = useMenuItemGroups();
  const { getUserMenuItemGroups, addMenuItemGroupToGroup, removeMenuItemGroupFromGroup } = useGroups();
  const { data: menuItemGroups, isLoading: isMenuItemGroupsLoading } = getMenuItemGroups();
  const { data: userMenuItemGroups, isLoading: isUserMenuItemGroupsLoading } = getUserMenuItemGroups(groupId);

  const [menuItemGroupStates, setMenuItemGroupStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (userMenuItemGroups) {
      const initialStates = userMenuItemGroups.reduce((acc, group) => {
        acc[group.id] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setMenuItemGroupStates(initialStates);
    }
  }, [userMenuItemGroups]);

  const handleToggle = async (menuItemGroupId: string) => {
    const newState = !menuItemGroupStates[menuItemGroupId];
    setMenuItemGroupStates({ ...menuItemGroupStates, [menuItemGroupId]: newState });

    if (newState) {
      await addMenuItemGroupToGroup({ groupId, menuItemGroupId });
    } else {
      await removeMenuItemGroupFromGroup({ groupId, menuItemGroupId });
    }
  };

  if (isMenuItemGroupsLoading || isUserMenuItemGroupsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Menu Item Group ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Assigned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItemGroups?.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>
                <Switch checked={!!menuItemGroupStates[group.id]} onChange={() => handleToggle(group.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
