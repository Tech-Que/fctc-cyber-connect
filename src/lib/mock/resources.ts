import type { Resource } from "@/types";

export const mockResources: Resource[] = [
  {
    id: "res_comptia_security",
    title: "CompTIA Security+",
    url: "https://www.comptia.org/certifications/security",
    description:
      "Entry-level cybersecurity certification and the most common first cert for program students.",
    category: "certification",
    sortOrder: 1,
  },
  {
    id: "res_comptia_network",
    title: "CompTIA Network+",
    url: "https://www.comptia.org/certifications/network",
    description: "Networking fundamentals; strong complement to Security+.",
    category: "certification",
    sortOrder: 2,
  },
  {
    id: "res_comptia_cysa",
    title: "CompTIA CySA+",
    url: "https://www.comptia.org/certifications/cybersecurity-analyst",
    description:
      "Intermediate analyst-focused certification. Good next step after Security+.",
    category: "certification",
    sortOrder: 3,
  },
  {
    id: "res_professor_messer",
    title: "Professor Messer",
    url: "https://www.professormesser.com",
    description:
      "Free, exhaustive video courses for Security+, Network+, and A+.",
    category: "certification",
    sortOrder: 4,
  },
  {
    id: "res_tryhackme",
    title: "TryHackMe",
    url: "https://tryhackme.com",
    description:
      "Guided cybersecurity labs with hands-on exercises — a great starting point.",
    category: "study",
    sortOrder: 1,
  },
  {
    id: "res_hackthebox",
    title: "Hack The Box",
    url: "https://www.hackthebox.com",
    description:
      "Progressive hacking challenges and realistic pentest environments.",
    category: "study",
    sortOrder: 2,
  },
  {
    id: "res_overthewire",
    title: "OverTheWire",
    url: "https://overthewire.org/wargames/",
    description:
      "Classic terminal-based wargames for learning Linux and basic security concepts.",
    category: "study",
    sortOrder: 3,
  },
  {
    id: "res_nist_csf",
    title: "NIST Cybersecurity Framework",
    url: "https://www.nist.gov/cyberframework",
    description:
      "Industry-standard reference framework for organizing cybersecurity work.",
    category: "study",
    sortOrder: 4,
  },
  {
    id: "res_cyberseek",
    title: "CyberSeek",
    url: "https://www.cyberseek.org",
    description:
      "Interactive map of the cybersecurity job market with role pathways and demand data.",
    category: "career",
    sortOrder: 1,
  },
  {
    id: "res_indeed_cyber",
    title: "Indeed — cybersecurity jobs",
    url: "https://www.indeed.com/q-cybersecurity-jobs.html",
    description:
      "Live job feed; good for gauging entry-level posting language and pay ranges.",
    category: "career",
    sortOrder: 2,
  },
  {
    id: "res_nice_framework",
    title: "NICE Cybersecurity Workforce Framework",
    url: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center",
    description:
      "Taxonomy of cyber roles, tasks, and knowledge areas published by NIST.",
    category: "career",
    sortOrder: 3,
  },
  {
    id: "res_fctc",
    title: "First Coast Technical College",
    url: "https://www.fctc.edu",
    description:
      "Official FCTC site — program information, admissions, and student resources.",
    category: "fctc",
    sortOrder: 1,
  },
];

export function getResourcesByCategory(
  category: Resource["category"],
): Resource[] {
  return mockResources
    .filter((r) => r.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAllResources(): Resource[] {
  return [...mockResources].sort((a, b) => a.sortOrder - b.sortOrder);
}
