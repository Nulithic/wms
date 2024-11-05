import { useState, useEffect } from "react";
import { useUsers } from "@/libs/api/queries/admin/usersQueries";
import { useGroups } from "@/libs/api/queries/admin/groupsQueries";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch } from "@mui/material";

interface UsersTableProps {
  groupId: string;
}

export default function UsersTable({ groupId }: UsersTableProps) {
  const { getUsers } = useUsers();
  const { getUsersInGroup, addUserToGroup, removeUserFromGroup } = useGroups();
  const { data: users, isLoading: isUsersLoading } = getUsers({ page: 1, perPage: 100 });
  const { data: groupUsers, isLoading: isGroupUsersLoading } = getUsersInGroup(groupId);

  const [userStates, setUserStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (groupUsers) {
      const initialStates = groupUsers.reduce((acc, user) => {
        acc[user.id] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setUserStates(initialStates);
    }
  }, [groupUsers]);

  const handleToggle = async (userId: string) => {
    const newState = !userStates[userId];
    setUserStates({ ...userStates, [userId]: newState });

    if (newState) {
      await addUserToGroup({ groupId, userId });
    } else {
      await removeUserFromGroup({ groupId, userId });
    }
  };

  if (isUsersLoading || isGroupUsersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>In Group</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Switch checked={!!userStates[user.id]} onChange={() => handleToggle(user.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
