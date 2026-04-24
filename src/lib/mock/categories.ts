import { nanoid } from "nanoid";
import type { Category } from "@/types";

const newId = () => `cat_${nanoid(8)}`;

const generalId = newId();
const certsId = newId();
const careerId = newId();
const labsId = newId();
const alumniId = newId();

export const CATEGORY_IDS = {
  general: generalId,
  certs: certsId,
  career: careerId,
  labs: labsId,
  alumni: alumniId,
};

export const mockCategories: Category[] = [
  {
    id: generalId,
    name: "General Discussion",
    slug: "general",
    description: "Open forum for anything program-related.",
    sortOrder: 1,
  },
  {
    id: certsId,
    name: "Certifications",
    slug: "certs",
    description: "Study tips, prep resources, and exam stories.",
    sortOrder: 2,
  },
  {
    id: careerId,
    name: "Career & Jobs",
    slug: "career",
    description: "Internships, interviews, and job leads.",
    sortOrder: 3,
  },
  {
    id: labsId,
    name: "Labs & Projects",
    slug: "labs",
    description: "Help with assignments, lab tips, and showcase projects.",
    sortOrder: 4,
  },
  {
    id: alumniId,
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
