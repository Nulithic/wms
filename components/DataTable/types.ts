import { type ColumnDef, type Table } from "@tanstack/react-table";

export interface ColumnMeta {
  openFilterMenu?: (columnId: string) => void;
}

export interface FilterCondition {
  column: string;
  operator: string;
  value: string;
}

export interface SortCondition {
  column: string;
  direction: "asc" | "desc";
}

export interface FilterMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterCondition[]) => void;
  columns: ColumnDef<any, any>[];
  table: Table<any>;
  initialColumn?: string;
}

export interface SortMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onApply: (sorts: SortCondition[]) => void;
  columns: ColumnDef<any, any>[];
  table: Table<any>;
}
