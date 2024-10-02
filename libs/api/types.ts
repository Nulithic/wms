export interface PageData {
  page: number;
  perPage: number;
}

export interface UserData {
  id: string;
  email: string;
  // Add other user properties
}

export interface RoleData {
  id: string;
  role_name: string;
  description: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

// Add other shared types
