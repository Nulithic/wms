import { Fragment, useEffect, useRef, type HTMLProps, useState, useMemo } from "react";
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
  type FilterFn,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  MenuItem,
  Typography,
  Popover,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

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

interface FilterCondition {
  column: string;
  operator: string;
  value: string;
}

interface FilterMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterCondition[]) => void;
  columns: ColumnDef<any, any>[];
  table: Table<any>;
  initialColumn?: string;
}

function FilterMenu({ anchorEl, open, onClose, onApply, columns, table, initialColumn }: FilterMenuProps) {
  // Temporary state for filter menu
  const [tempConditions, setTempConditions] = useState<FilterCondition[]>([]);

  // Initialize or reset temp conditions when menu opens
  useEffect(() => {
    if (open) {
      const activeFilters = table.getState().columnFilters.map((filter) => ({
        column: filter.id,
        operator: (filter.value as { operator: string })?.operator || "starts with",
        value: (filter.value as { value: string })?.value || "",
      }));

      if (activeFilters.length > 0) {
        if (initialColumn) {
          const columnExists = activeFilters.some((filter) => filter.column === initialColumn);
          if (!columnExists) {
            setTempConditions([
              ...activeFilters,
              {
                column: initialColumn,
                operator: "starts with",
                value: "",
              },
            ]);
          } else {
            setTempConditions(activeFilters);
          }
        } else {
          setTempConditions(activeFilters);
        }
      } else {
        setTempConditions([
          {
            column: initialColumn || "",
            operator: "starts with",
            value: "",
          },
        ]);
      }
    }
  }, [open, initialColumn, table]);

  const handleAddFilter = () => {
    const availableColumns = filteredColumns.filter((column) => !tempConditions.some((c) => c.column === column.id));

    if (availableColumns.length > 0) {
      setTempConditions([...tempConditions, { column: "", operator: "starts with", value: "" }]);
    }
  };

  const handleRemoveFilter = (index: number) => {
    setTempConditions(tempConditions.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof FilterCondition, value: string) => {
    const newConditions = [...tempConditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setTempConditions(newConditions);
  };

  const handleClearAll = () => {
    setTempConditions([{ column: "", operator: "starts with", value: "" }]);
  };

  const handleApply = () => {
    // Apply filters that either have a value or use blank operators
    const validFilters = tempConditions.filter(
      (c) => c.column && (["is blank", "is not blank"].includes(c.operator) || c.value),
    );
    onApply(validFilters);
    onClose();
  };

  // Filter out the 'select' column and get proper column headers
  const filteredColumns = useMemo(
    () =>
      columns
        .filter((column) => column.id !== "select")
        .map((column) => ({
          id: column.id as string,
          header:
            column.header && typeof column.header === "string"
              ? column.header
              : typeof column.header === "function"
              ? (column.header as any)()?.props?.children || column.id
              : column.id,
        })),
    [columns],
  );

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
            minWidth: 600,
          },
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        In this view, show records
      </Typography>
      <Stack spacing={2}>
        {tempConditions.map((condition, index) => (
          <Box key={index}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ minWidth: 120 }}>
                {index === 0 ? <Typography>Where</Typography> : <Typography>and</Typography>}
              </Box>
              <TextField
                select
                size="small"
                value={condition.column}
                onChange={(e) => handleChange(index, "column", e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {filteredColumns
                  .filter((column) => !tempConditions.some((c, i) => i !== index && c.column === column.id))
                  .map((column) => (
                    <MenuItem key={column.id} value={column.id}>
                      {column.header}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                select
                size="small"
                value={condition.operator}
                onChange={(e) => handleChange(index, "operator", e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="starts with">starts with</MenuItem>
                <MenuItem value="contains">contains</MenuItem>
                <MenuItem value="does not contain">does not contain</MenuItem>
                <MenuItem value="is">is</MenuItem>
                <MenuItem value="is not">is not</MenuItem>
                <MenuItem value="is blank">is blank</MenuItem>
                <MenuItem value="is not blank">is not blank</MenuItem>
              </TextField>
              {!["is blank", "is not blank"].includes(condition.operator) && (
                <TextField
                  size="small"
                  value={condition.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  sx={{ minWidth: 150 }}
                />
              )}
              {tempConditions.length > 1 && (
                <IconButton size="small" onClick={() => handleRemoveFilter(index)}>
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            size="small"
            onClick={handleAddFilter}
            startIcon={<AddIcon />}
            disabled={filteredColumns.length <= tempConditions.length}
          >
            Add a filter
          </Button>
          <Button size="small" onClick={handleClearAll}>
            Clear all filters
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">
            Apply
          </Button>
        </Box>
      </Stack>
    </Popover>
  );
}

function filterByOperator(value: any, filterValue: string, operator: string): boolean {
  // Handle null/undefined values
  if (value == null) {
    return operator === "is blank" || operator === "is not" || operator === "is not blank";
  }

  const stringValue = String(value).toLowerCase();
  const filterString = filterValue.toLowerCase();

  switch (operator) {
    case "starts with":
      return stringValue.startsWith(filterString);
    case "contains":
      return stringValue.includes(filterString);
    case "does not contain":
      return !stringValue.includes(filterString);
    case "is":
      return stringValue === filterString;
    case "is not":
      return stringValue !== filterString;
    case "is blank":
      return !stringValue.trim();
    case "is not blank":
      return stringValue.trim().length > 0;
    default:
      return false;
  }
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
}: DataTableProps<TData>) {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const filterButtonRef = useRef<HTMLButtonElement>(null);

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
  });

  return (
    <Fragment>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          ref={filterButtonRef}
          variant="outlined"
          startIcon={<FilterListIcon />}
          size="small"
          onClick={handleFilterClick}
        >
          Filter
        </Button>
        <Button variant="outlined" startIcon={<SortIcon />} size="small">
          Sort
        </Button>
        {enableGlobalFilter && (
          <TextField
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            variant="outlined"
            size="small"
            sx={{ ml: "auto", width: 300 }}
          />
        )}
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

      <TableContainer component={Paper}>
        <MUITable>
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
                        {header.column.getCanFilter() ? <Filter column={header.column} /> : null}
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
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
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
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count > 0 ? count : "Over " + to}`}
              />
            </TableRow>
          </TableFooter>
        </MUITable>
      </TableContainer>
    </Fragment>
  );
}
