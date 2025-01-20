"use client";

import { Fragment, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { type ColumnDef, type RowSelectionState } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable/DataTable";
import { IndeterminateCheckbox } from "@/components/DataTable/IndeterminateCheckbox";
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
    perPage: 1,
  });

  const { getUsers, addUser, deleteUser } = useUsers();

  const { data, isLoading, isError } = getUsers(pageData);

  console.log(data?.users);

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
        id: "id",
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
        id: "email",
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

  const handleDeleteUser = async (selectedRows: User[]) => {
    for (const user of selectedRows) {
      await deleteUserMutation.mutateAsync(user.id);
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
      </div>

      <DataTable
        data={data?.users || []}
        columns={columns}
        enableRowSelection
        // enableGlobalFilter
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pageData={pageData}
        onPageDataChange={setPageData}
        totalCount={data?.total || 0}
        onDeleteSelected={handleDeleteUser}
      />

      <AddUserDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddUser={handleAddUser} />
    </Fragment>
  );
}
