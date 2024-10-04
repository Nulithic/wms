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

// Add other shared types
