import { useState, useEffect, useMemo } from "react";
import { Box, Button, IconButton, MenuItem, Popover, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import type { SortMenuProps, SortCondition } from "../../types";
import { TableMenuButton } from "./TableMenuButton";

export function SortMenu({ anchorEl, open, onClose, onApply, columns, table }: SortMenuProps) {
  const [tempConditions, setTempConditions] = useState<SortCondition[]>([]);

  // Initialize temp conditions when menu opens
  useEffect(() => {
    if (open) {
      const activeSorts = table.getState().sorting.map(
        (sort) =>
          ({
            column: sort.id,
            direction: sort.desc ? "desc" : "asc",
          } as SortCondition),
      );
      setTempConditions(activeSorts.length > 0 ? activeSorts : [{ column: "", direction: "asc" }]);
    }
  }, [open, table]);

  const handleAddSort = () => {
    const availableColumns = filteredColumns.filter((column) => !tempConditions.some((c) => c.column === column.id));

    if (availableColumns.length > 0) {
      setTempConditions([...tempConditions, { column: "", direction: "asc" }]);
    }
  };

  const handleRemoveSort = (index: number) => {
    setTempConditions(tempConditions.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof SortCondition, value: string) => {
    const newConditions = [...tempConditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setTempConditions(newConditions);
  };

  const handleClearAll = () => {
    setTempConditions([{ column: "", direction: "asc" }]);
  };

  const handleApply = () => {
    const validSorts = tempConditions.filter((c) => c.column);
    onApply(validSorts);
    onClose();
  };

  // Filter out the 'select' column
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
            borderRadius: 1,
            p: 2,
          },
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sorting
      </Typography>
      <Stack spacing={2}>
        {tempConditions.map((condition, index) => (
          <Box key={index}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ minWidth: 120 }}>
                {index === 0 ? <Typography>Sort by</Typography> : <Typography>then by</Typography>}
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
                value={condition.direction}
                onChange={(e) => handleChange(index, "direction", e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="asc">ascending</MenuItem>
                <MenuItem value="desc">descending</MenuItem>
              </TextField>
              {tempConditions.length > 1 && (
                <IconButton size="small" onClick={() => handleRemoveSort(index)}>
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <TableMenuButton
            onClick={handleAddSort}
            startIcon={<AddIcon />}
            disabled={filteredColumns.length <= tempConditions.length}
          >
            Add a sort
          </TableMenuButton>
          <TableMenuButton onClick={handleClearAll}>Clear all sorts</TableMenuButton>
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
