export type Role = "prospective" | "current" | "alumni" | "admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  graduationYear?: number;
  certList?: string[];
  createdAt: string; // ISO date string
  deletedAt?: string | null;
}
