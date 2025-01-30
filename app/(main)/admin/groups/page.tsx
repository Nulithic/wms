"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import AddGroupDialog from "./AddGroupDialog";

import { useGroups } from "@/libs/api/queries/admin/groupsQueries";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GroupData } from "@/libs/api/types";
import { DataTable } from "@/components/DataTable/DataTable";
import { IndeterminateCheckbox } from "@/components/DataTable/IndeterminateCheckbox";

import { useTitle } from "@/components/NavBar/TitleContext";

export default function Groups() {
  const { setShowNavBar, setTitle, setActions } = useTitle();

  const pathname = usePathname();
  const [pageData, setPageData] = useState({
    page: 1,
    perPage: 10,
  });

  const { getGroups, addGroup, deleteGroup } = useGroups();
  const { data, isLoading, isError } = getGroups(pageData);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<GroupData>[]>(
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
        id: "name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
    ],
    [pathname],
  );

  const handleAddGroup = async (groupData: any) => {
    await addGroup(groupData);
    setOpenAddDialog(false);
  };

  const handleDeleteGroup = async (selectedRows: GroupData[]) => {
    for (const row of selectedRows) {
      await deleteGroup(row.id);
    }
    setRowSelection({});
  };

  const navBarActions = useMemo(
    () => (
      <>
        <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
          Add Group
        </Button>
      </>
    ),
    [],
  );

  useEffect(() => {
    setShowNavBar(true);
    setTitle("Groups");
    setActions(navBarActions);
    return () => {
      setShowNavBar(false);
      setTitle("");
      setActions(null);
    };
  }, [setShowNavBar, setActions, navBarActions]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading groups</div>;

  return (
    <Fragment>
      <DataTable
        data={data?.groups || []}
        columns={columns}
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pageData={pageData}
        onPageDataChange={setPageData}
        totalCount={data?.total || 0}
        onDeleteSelected={handleDeleteGroup}
      />

      <AddGroupDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddGroup={handleAddGroup} />
    </Fragment>
  );
}
