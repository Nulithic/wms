import { Fragment, useRef, useState, useMemo } from "react";
import {
  type Column,
  type ColumnDef,
  type RowSelectionState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
  getSortedRowModel,
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
  Button,
  Stack,
  Chip,
  IconButton,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { FilterMenu, SortMenu } from "./components/Menus";
import { DataTableButton } from "./components";
import { filterByOperator } from "./filterUtils";

interface ColumnMeta {
  openFilterMenu?: (columnId: string) => void;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
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
  onDeleteSelected?: (selectedRows: TData[]) => void;
}

interface FilterCondition {
  column: string;
  operator: string;
  value: string;
}

interface SortCondition {
  column: string;
  direction: "asc" | "desc";
}

function Filter({ column }: { column: Column<any, any> & { columnDef: { meta?: ColumnMeta } } }) {
  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation(); // Prevent header click event
        column.columnDef.meta?.openFilterMenu?.(column.id);
      }}
    >
      <FilterListIcon fontSize="small" />
    </IconButton>
  );
}

function Sort({ column }: { column: Column<any, any> }) {
  const sortDirection = column.getIsSorted();

  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        column.toggleSorting(undefined, true); // Always use multi-sort
      }}
      sx={{
        opacity: sortDirection ? 1 : 0.5,
        "&:hover": { opacity: 1 },
      }}
    >
      {sortDirection === "asc" ? (
        <ArrowUpwardIcon fontSize="small" />
      ) : sortDirection === "desc" ? (
        <ArrowDownwardIcon fontSize="small" />
      ) : (
        <SortIcon fontSize="small" />
      )}
    </IconButton>
  );
}

export function DataTable<TData>({
  data,
  columns: originalColumns,
  enableRowSelection = false,
  enableGlobalFilter = false,
  rowSelection = {},
  onRowSelectionChange = () => {},
  pageData,
  onPageDataChange,
  totalCount = 0,
  onDeleteSelected,
}: DataTableProps<TData>) {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  // Add meta property to columns to handle filter menu opening
  const columns = useMemo(
    () =>
      originalColumns.map(
        (col) =>
          ({
            ...col,
            filterFn: ((row, columnId, value) => {
              const cellValue = row.getValue(columnId);
              return filterByOperator(cellValue, value.value, value.operator);
            }) as FilterFn<TData>,
            meta: {
              ...col.meta,
              openFilterMenu: (columnId: string) => {
                setSelectedColumn(columnId);
                setFilterAnchorEl(filterButtonRef.current);
              },
            },
          } as ColumnDef<TData, any>),
      ),
    [originalColumns],
  );

  const handleFilterClick = () => {
    setFilterAnchorEl(filterButtonRef.current);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setSelectedColumn("");
  };

  const handleFilterApply = (filters: FilterCondition[]) => {
    // Clear all existing filters first
    table.getAllColumns().forEach((column) => {
      column.setFilterValue(undefined);
    });
    // Then apply new filters
    filters.forEach((filter) => {
      table.getColumn(filter.column)?.setFilterValue({
        value: filter.value,
        operator: filter.operator,
      });
    });
    handleFilterClose();
  };

  const handleSortClick = () => {
    setSortAnchorEl(sortButtonRef.current);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortApply = (sorts: SortCondition[]) => {
    table.setSorting(
      sorts.map((sort) => ({
        id: sort.column,
        desc: sort.direction === "desc",
      })),
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: pageData.page - 1,
        pageSize: pageData.perPage,
      },
    },
    enableRowSelection,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageData.perPage),
    filterFns: {
      custom: (row, columnId, filterValue: { value: string; operator: string }) => {
        const value = row.getValue(columnId);
        return filterByOperator(value, filterValue.value, filterValue.operator);
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return filterByOperator(value, filterValue, "contains");
    },
    enableSorting: true,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Fragment>
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {Object.keys(rowSelection).length > 0 ? (
            <Fragment>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2">{Object.keys(rowSelection).length} row(s) selected</Typography>
                <DataTableButton
                  color="error"
                  onClick={() => onDeleteSelected?.(table.getSelectedRowModel().rows.map((row) => row.original))}
                >
                  Delete Selected
                </DataTableButton>
              </Box>
            </Fragment>
          ) : (
            <Fragment>
              <DataTableButton ref={filterButtonRef} startIcon={<FilterListIcon />} onClick={handleFilterClick}>
                Filter
              </DataTableButton>
              <DataTableButton ref={sortButtonRef} startIcon={<SortIcon />} size="small" onClick={handleSortClick}>
                Sort
              </DataTableButton>
            </Fragment>
          )}

          {enableGlobalFilter && (
            <TextField
              value={table.getState().globalFilter ?? ""}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small">
              <Select
                value={pageData.perPage}
                onChange={(e) => {
                  onPageDataChange({
                    page: 1,
                    perPage: Number(e.target.value),
                  });
                }}
                variant="outlined"
                sx={{
                  minWidth: 80,
                  height: 32,
                  "& .MuiSelect-select": {
                    py: 0.5,
                    px: 1,
                  },
                }}
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <MenuItem key={pageSize} value={pageSize}>
                    {pageSize}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2">
              {`${(pageData.page - 1) * pageData.perPage + 1} - ${Math.min(
                pageData.page * pageData.perPage,
                totalCount,
              )} of ${totalCount}`}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => onPageDataChange({ ...pageData, page: pageData.page - 1 })}
                disabled={pageData.page === 1}
                sx={{ minWidth: 32, p: 0.5 }}
              >
                <NavigateBeforeIcon fontSize="small" />
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => onPageDataChange({ ...pageData, page: pageData.page + 1 })}
                disabled={pageData.page >= Math.ceil(totalCount / pageData.perPage)}
                sx={{ minWidth: 32, p: 0.5 }}
              >
                <NavigateNextIcon fontSize="small" />
              </Button>
            </Box>
          </Box>
        </Box>
      </Stack>

      <FilterMenu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
        columns={columns}
        table={table}
        initialColumn={selectedColumn}
      />

      <SortMenu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        onApply={handleSortApply}
        columns={columns}
        table={table}
      />

      <TableContainer component={Paper}>
        <MUITable size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      fontWeight: "bold",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanFilter() && <Filter column={header.column} />}
                        {header.column.getCanSort() && <Sort column={header.column} />}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                  },
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id.toLowerCase().includes("status") ? (
                      <Chip
                        label={String(cell.getValue())}
                        size="small"
                        sx={{
                          backgroundColor: "#757575",
                          color: "#fff",
                          borderRadius: "16px",
                        }}
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow></TableRow>
          </TableFooter>
        </MUITable>
      </TableContainer>
    </Fragment>
  );
}
