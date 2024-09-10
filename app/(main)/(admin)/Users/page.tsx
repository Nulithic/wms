"use client";

import { Fragment, useEffect, useMemo, useRef, useState, HTMLProps } from "react";
import { Button, Paper } from "@mui/material";

import { Column, ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, Table, useReactTable } from "@tanstack/react-table";

import AddUserDialog from "./addUserDialog";

interface User {
  id: string;
  email: string;
}

export default function Users() {
  const [data, setData] = useState<User[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [pageData, setPageData] = useState({
    page: 1,
    perPage: 10,
  });

  function Filter({ column, table }: { column: Column<any, any>; table: Table<any> }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

    return typeof firstValue === "number" ? (
      <div className="flex space-x-2">
        <input
          type="number"
          value={((column.getFilterValue() as any)?.[0] ?? "") as string}
          onChange={(e) => column.setFilterValue((old: any) => [e.target.value, old?.[1]])}
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <input
          type="number"
          value={((column.getFilterValue() as any)?.[1] ?? "") as string}
          onChange={(e) => column.setFilterValue((old: any) => [old?.[0], e.target.value])}
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
    ) : (
      <input type="text" value={(column.getFilterValue() ?? "") as string} onChange={(e) => column.setFilterValue(e.target.value)} placeholder={`Search...`} className="w-36 border shadow rounded" />
    );
  }

  function IndeterminateCheckbox({ indeterminate, className = "", ...rest }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null!);

    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate, rest.checked]);

    return <input type="checkbox" ref={ref} className={className + " cursor-pointer"} {...rest} />;
  }

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
        cell: (info) => info.getValue(),
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
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleGetUsers = async (action: string, body: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, ...body }),
      });

      if (!response.ok) {
        throw new Error("Failed to get users");
      }

      const result = await response.json();

      setData(result);

      console.log("Users:", result);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  };

  const handleAddUser = async (userData: any) => {
    try {
      const response = await fetch("/api/users?action=addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const result = await response.json();

      handleGetUsers("getUsers", pageData);

      console.log("User added:", result.user);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;

      for (let i = 0; i < selectedRows.length; i++) {
        const selected = selectedRows[i].original;
        console.log(selected.id);

        const response = await fetch("/api/users?action=deleteUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: selected.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        const result = await response.json();
        console.log("User deleted:", result.user);
      }

      table.resetRowSelection();
      handleGetUsers("getUsers", pageData);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    handleGetUsers("getUsers", pageData);
  }, [pageData]);

  return (
    <Fragment>
      <Button variant="outlined" onClick={() => setOpenAddDialog(true)}>
        Add User
      </Button>

      <Button variant="outlined" onClick={() => handleDeleteUser()}>
        Delete User
      </Button>

      <div>
        <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} className="p-2 font-lg shadow border border-block" placeholder="Search all columns..." />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-1"></td>
          </tr>
        </tfoot>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button className="border rounded p-1" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {"<<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button className="border rounded p-1" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div>
        {Object.keys(rowSelection).length} of {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>

      <AddUserDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddUser={handleAddUser} />
    </Fragment>
  );
}