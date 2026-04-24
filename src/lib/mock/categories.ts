import type { Category } from "@/types";

export const CATEGORY_IDS = {
  general: "cat_general",
  certs: "cat_certs",
  career: "cat_career",
  labs: "cat_labs",
  alumni: "cat_alumni",
};

export const mockCategories: Category[] = [
  {
    id: CATEGORY_IDS.general,
    name: "General Discussion",
    slug: "general",
    description: "Open forum for anything program-related.",
    sortOrder: 1,
  },
  {
    id: CATEGORY_IDS.certs,
    name: "Certifications",
    slug: "certs",
    description: "Study tips, prep resources, and exam stories.",
    sortOrder: 2,
  },
  {
    id: CATEGORY_IDS.career,
    name: "Career & Jobs",
    slug: "career",
    description: "Internships, interviews, and job leads.",
    sortOrder: 3,
  },
  {
    id: CATEGORY_IDS.labs,
    name: "Labs & Projects",
    slug: "labs",
    description: "Help with assignments, lab tips, and showcase projects.",
    sortOrder: 4,
  },
  {
    id: CATEGORY_IDS.alumni,
    name: "Alumni Network",
    slug: "alumni",
    description: "Alumni check-ins and mentorship.",
    sortOrder: 5,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((c) => c.slug === slug);
}

export function getAllCategories(): Category[] {
  return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}
