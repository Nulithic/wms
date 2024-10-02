"use client";

import { Fragment, useEffect, useMemo, useRef, useState, HTMLProps } from "react";
import { Button, Checkbox } from "@mui/material";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";

import AddRoleDialog from "./addRoleDialog";

import { useRoles } from "@/libs/api/queries/rolesQueries";

import { RoleData } from "@/libs/api/types";

export default function Roles() {
  const [pageData, setPageData] = useState({
    page: 1,
    perPage: 10,
  });
  const { getRoles, addRole, deleteRole } = useRoles();

  const { data: roles, isLoading, isError } = getRoles(pageData);
  const addRoleMutation = addRole();
  const deleteRoleMutation = deleteRole();

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

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
      <input
        type="text"
        value={(column.getFilterValue() ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
        className="w-36 border shadow rounded"
      />
    );
  }

  function IndeterminateCheckbox({
    indeterminate,
    className = "",
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null!);

    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate, rest.checked]);

    return <input type="checkbox" ref={ref} className={className + " cursor-pointer"} {...rest} />;
  }

  const columns = useMemo<ColumnDef<RoleData>[]>(
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
        accessorKey: "role_name",
        header: () => <span>Name</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: () => <span>Description</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "create",
        header: () => <span>Create</span>,
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              checked={row.original.create}
              onChange={() => {
                row.original.create = !row.original.create;
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "read",
        header: () => <span>Read</span>,
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              checked={row.original.read}
              onChange={() => {
                row.original.read = !row.original.read;
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "update",
        header: () => <span>Update</span>,
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              checked={row.original.update}
              onChange={() => {
                row.original.update = !row.original.update;
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "delete",
        header: () => <span>Delete</span>,
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              checked={row.original.delete}
              onChange={() => {
                row.original.delete = !row.original.delete;
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: roles || [],
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

  const handleAddRole = async (roleData: any) => {
    console.log(roleData);

    await addRoleMutation.mutateAsync(roleData);
    setOpenAddDialog(false);
  };

  const handleDeleteRole = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    for (const row of selectedRows) {
      await deleteRoleMutation.mutateAsync(row.original.id);
    }
    table.resetRowSelection();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading roles</div>;

  return (
    <Fragment>
      <Button variant="outlined" onClick={() => setOpenAddDialog(true)}>
        Add Role
      </Button>

      <Button variant="outlined" color="error" onClick={() => handleDeleteRole()}>
        Delete Role
      </Button>

      <div>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
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
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
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

      <AddRoleDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddRole={handleAddRole} />
    </Fragment>
  );
}
