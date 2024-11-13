"use client";

import { Fragment, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { type ColumnDef, type RowSelectionState } from "@tanstack/react-table";
import { DataTable, IndeterminateCheckbox } from "@/components/DataTable/DataTable";
import AddUserDialog from "./AddUserDialog";
import { useUsers } from "@/libs/api/queries/admin/usersQueries";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
}

export default function Users() {
  const pathname = usePathname();
  const [pageData, setPageData] = useState({
    page: 1,
    perPage: 10,
  });

  const { getUsers, addUser, deleteUser } = useUsers();
  const { data: users, isLoading, isError } = getUsers(pageData);
  const addUserMutation = addUser();
  const deleteUserMutation = deleteUser();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "id",
        cell: (info) => (
          <Link href={`${pathname}/${info.getValue()}`} className="text-blue-600 hover:underline">
            {String(info.getValue())}
          </Link>
        ),
        header: () => <span>ID</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "email",
        cell: (info) => info.getValue(),
        header: () => <span>Email</span>,
        footer: (props) => props.column.id,
      },
    ],
    [pathname],
  );

  const handleAddUser = async (userData: any) => {
    await addUserMutation.mutateAsync(userData);
    setOpenAddDialog(false);
  };

  const handleDeleteUser = async () => {
    const selectedIds = Object.keys(rowSelection);
    for (const id of selectedIds) {
      await deleteUserMutation.mutateAsync(id);
    }
    setRowSelection({});
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <Fragment>
      <div className="space-x-2 mb-4">
        <Button variant="outlined" onClick={() => setOpenAddDialog(true)}>
          Add User
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteUser}
          disabled={Object.keys(rowSelection).length === 0}
        >
          Delete Selected
        </Button>
      </div>

      <DataTable
        data={users || []}
        columns={columns}
        enableRowSelection
        enableGlobalFilter
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pageData={pageData}
        onPageDataChange={setPageData}
        totalCount={users?.length || 0}
      />

      <AddUserDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddUser={handleAddUser} />
    </Fragment>
  );
}
