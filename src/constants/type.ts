export const Role = {
  Owner: "Owner",
  Employee: "Employee",
  Guest: "Guest",
  Admin: "Admin",
} as const;

export const RoleValues = [
  Role.Admin,
  Role.Employee,
  Role.Guest,
  Role.Owner,
] as const;
