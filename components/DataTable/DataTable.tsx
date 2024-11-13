import { Fragment, useEffect, useRef, type HTMLProps } from "react";
import {
  type Column,
  type ColumnDef,
  type Table,
  type RowSelectionState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  TextField,
} from "@mui/material";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableRowSelection?: boolean;
  enableGlobalFilter?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  pageData: {
    page: number;
    perPage: number;
  };
  onPageDataChange: (newPageData: { page: number; perPage: number }) => void;
  totalCount?: number;
}

export function IndeterminateCheckbox({
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

function Filter({ column, table }: { column: Column<any, any>; table: Table<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <TextField
        type="number"
        size="small"
        value={((column.getFilterValue() as any)?.[0] ?? "") as string}
        onChange={(e) => column.setFilterValue((old: any) => [e.target.value, old?.[1]])}
        placeholder="Min"
      />
      <TextField
        type="number"
        size="small"
        value={((column.getFilterValue() as any)?.[1] ?? "") as string}
        onChange={(e) => column.setFilterValue((old: any) => [old?.[0], e.target.value])}
        placeholder="Max"
      />
    </div>
  ) : (
    <TextField
      size="small"
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
    />
  );
}

export function DataTable<TData>({
  data,
  columns,
  enableRowSelection = false,
  enableGlobalFilter = false,
  rowSelection = {},
  onRowSelectionChange = () => {},
  pageData,
  onPageDataChange,
  totalCount = 0,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: pageData.page - 1, // Convert to 0-based index
        pageSize: pageData.perPage,
      },
    },
    enableRowSelection,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable manual pagination
    pageCount: Math.ceil(totalCount / pageData.perPage),
  });

  return (
    <Fragment>
      {enableGlobalFilter && (
        <TextField
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          fullWidth
        />
      )}

      <TableContainer component={Paper}>
        <MUITable>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} colSpan={header.colSpan}>
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
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                count={totalCount}
                rowsPerPage={pageData.perPage}
                page={pageData.page - 1} // Convert to 0-based index
                onPageChange={(_, newPage) => {
                  onPageDataChange({
                    ...pageData,
                    page: newPage + 1, // Convert back to 1-based index
                  });
                }}
                onRowsPerPageChange={(e) => {
                  onPageDataChange({
                    page: 1, // Reset to first page when changing page size
                    perPage: Number(e.target.value),
                  });
                }}
              />
            </TableRow>
          </TableFooter>
        </MUITable>
      </TableContainer>
    </Fragment>
  );
}
