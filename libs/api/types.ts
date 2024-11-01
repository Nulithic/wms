export interface PageData {
  page: number;
  perPage: number;
}

export interface UserData {
  id: string;
  email: string;
  // Add other user properties
}

export interface GroupData {
  id: string;
  name: string;
  // Add other group properties
}
export interface GroupDataResponse {
  groups: GroupData[];
  totalCount: number;
}

export interface MenuItemData {
  id: string;
  title: string;
  group_id: string | null;
  parent_id: string | null;
  path: string | null;
  order_index: number;
}

export interface MenuItemGroupData {
  id: string;
  name: string;
  order_index: number;
}
// Add other shared types
