// src/config/roles.ts

export const roles = {
  admin: "admin" as const,
  user: "user" as const,
  guest: "guest" as const,
} as const;

// type Roles = (typeof roles)[keyof typeof roles];

export type Role = keyof typeof roles;

export type RolePermissions = {
  [key in Role]: string[];
};

export const rolePermissions: RolePermissions = {
  admin: ["createUser", "deleteUser", "updateUser", "viewUser"],
  user: ["viewUser"],
  guest: [],
};
