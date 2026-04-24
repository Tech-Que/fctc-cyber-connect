import type { User } from "@/types";

export const USER_IDS = {
  marcus: "user_marcus",
  priya: "user_priya",
  devon: "user_devon",
  sara: "user_sara",
  jake: "user_jake",
  admin: "user_admin",
};

export const mockUsers: User[] = [
  {
    id: USER_IDS.marcus,
    email: "marcus.chen@example.com",
    displayName: "Marcus Chen",
    role: "prospective",
    bio: "Just starting to explore cybersecurity. Interested in SOC analyst roles.",
    createdAt: "2026-04-18T14:32:00Z",
  },
  {
    id: USER_IDS.priya,
    email: "priya.patel@example.com",
    displayName: "Priya Patel",
    role: "prospective",
    bio: "Career switcher from retail management. Drawn to blue team work.",
    createdAt: "2026-04-15T09:21:00Z",
  },
  {
    id: USER_IDS.devon,
    email: "devon.hayes@example.com",
    displayName: "Devon Hayes",
    role: "current",
    bio: "Second semester. Love the Wireshark labs, hate the writeups.",
    graduationYear: 2026,
    createdAt: "2025-08-20T10:00:00Z",
  },
  {
    id: USER_IDS.sara,
    email: "sara.nguyen@example.com",
    displayName: "Sara Nguyen",
    role: "current",
    bio: "First-year student. Aiming for Security+ by spring.",
    graduationYear: 2027,
    createdAt: "2026-01-14T08:45:00Z",
  },
  {
    id: USER_IDS.jake,
    email: "jake.ramirez@example.com",
    displayName: "Jake Ramirez",
    role: "alumni",
    bio: "FCTC 2024 grad. Tier 1 SOC analyst at a regional healthcare network.",
    graduationYear: 2024,
    certList: ["Security+", "Network+", "CySA+"],
    createdAt: "2022-08-15T00:00:00Z",
  },
  {
    id: USER_IDS.admin,
    email: "admin@fctc.example.edu",
    displayName: "Program Admin",
    role: "admin",
    createdAt: "2022-01-01T00:00:00Z",
  },
];

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id && !u.deletedAt);
}

export function getUsersByRole(role: User["role"]): User[] {
  return mockUsers.filter((u) => u.role === role && !u.deletedAt);
}
