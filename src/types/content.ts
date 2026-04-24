export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: "certification" | "study" | "career" | "fctc";
  sortOrder: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
}
