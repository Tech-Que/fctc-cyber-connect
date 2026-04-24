import type { FAQ } from "@/types";

export const mockFaqs: FAQ[] = [
  {
    id: "faq_duration",
    question: "How long is the cybersecurity program?",
    answer:
      "The program runs approximately 18 months of full-time enrollment. Part-time options extend that timeline. The curriculum is organized into core foundations, specialized tracks, and a capstone project.",
    sortOrder: 1,
    published: true,
  },
  {
    id: "faq_certifications",
    question: "What certifications will I earn?",
    answer:
      "Students are prepared for CompTIA Security+, Network+, and CySA+. The certification exams themselves are not automatically included in tuition, though financial aid often covers the first attempt. Some students also pursue PenTest+ or vendor-specific certifications during the program.",
    sortOrder: 2,
    published: true,
  },
  {
    id: "faq_prior_experience",
    question: "Do I need prior computer experience?",
    answer:
      "Basic computer literacy is required — comfort using a desktop OS, navigating file systems, and working through multi-step tasks. No prior programming or networking background is assumed; the first modules cover fundamentals from the ground up.",
    sortOrder: 3,
    published: true,
  },
  {
    id: "faq_financial_aid",
    question: "Is financial aid available?",
    answer:
      "Yes. FCTC participates in federal financial aid programs, offers scholarships specific to technical education, and can connect qualifying students with workforce development grants. Fill out the FAFSA and book a one-on-one with the financial aid office for your specific situation.",
    sortOrder: 4,
    published: true,
  },
  {
    id: "faq_work_schedule",
    question: "Can I work while in the program?",
    answer:
      "Yes, particularly in the part-time track. Many current students work 20–30 hours a week and attend classes around their schedule. Lab access outside of class hours is available on most days.",
    sortOrder: 5,
    published: true,
  },
  {
    id: "faq_prerequisites",
    question: "What are the prerequisites?",
    answer:
      "A high school diploma or equivalent, placement into college-level math, and basic computer literacy. Some students arrive straight from high school, others are career changers; both paths are common and supported.",
    sortOrder: 6,
    published: true,
  },
  {
    id: "faq_placement_rate",
    question: "What's the job placement rate?",
    answer:
      "The program has historically placed a majority of graduates into cybersecurity or adjacent IT roles within six months of graduation. Regional employers — hospitals, financial institutions, and government contractors — actively recruit from FCTC. Career services supports resume review, interview prep, and employer introductions.",
    sortOrder: 7,
    published: true,
  },
  {
    id: "faq_transfer_credits",
    question: "Can I transfer credits to a 4-year program?",
    answer:
      "Several Florida state universities accept FCTC cybersecurity credits toward their bachelor's programs under articulation agreements. UNF, UCF, and USF are common transfer destinations. Talk with an advisor early in the program to plan transfer-friendly course selection.",
    sortOrder: 8,
    published: true,
  },
];

export function getPublishedFaqs(): FAQ[] {
  return mockFaqs
    .filter((f) => f.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
