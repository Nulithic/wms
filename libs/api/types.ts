export interface PageData {
  page: number;
  perPage: number;
}

export interface UserData {
  id: string;
  email: string;
}

export interface UserListRepsonse {
  users: UserData[];
  total: number;
}

export interface GroupData {
  id: string;
  name: string;
}
export interface GroupDataResponse {
  groups: GroupData[];
  total: number;
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

export interface MenuGroupData {
  id: string;
  group_id: string;
  menu_item_group_id: string;
  created_at: string;
}
