import { useState, useEffect, useMemo } from "react";
import { Box, Button, IconButton, MenuItem, Popover, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import type { FilterMenuProps, FilterCondition } from "../../types";
import { TableMenuButton } from "./TableMenuButton";

export function FilterMenu({ anchorEl, open, onClose, onApply, columns, table, initialColumn }: FilterMenuProps) {
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
            borderRadius: 1,
            p: 2,
          },
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
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
          <TableMenuButton
            onClick={handleAddFilter}
            startIcon={<AddIcon />}
            disabled={filteredColumns.length <= tempConditions.length}
          >
            Add a filter
          </TableMenuButton>
          <TableMenuButton onClick={handleClearAll}>Clear all filters</TableMenuButton>
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
