import { nanoid } from "nanoid";
import type { Thread } from "@/types";
import { USER_IDS } from "./users";
import { CATEGORY_IDS } from "./categories";

const newId = () => `thread_${nanoid(8)}`;

const codeOfConductId = newId();
const secPlusPassedId = newId();
const wiresharkLabId = newId();
const internshipsCuId = newId();
const cysaStudyGroupId = newId();
const laptopSpecsId = newId();
const week1JittersId = newId();
const tryhackmeVsHtbId = newId();
const resumeReviewId = newId();
const certsVsDegreesId = newId();

export const THREAD_IDS = {
  codeOfConduct: codeOfConductId,
  secPlusPassed: secPlusPassedId,
  wiresharkLab: wiresharkLabId,
  internshipsCu: internshipsCuId,
  cysaStudyGroup: cysaStudyGroupId,
  laptopSpecs: laptopSpecsId,
  week1Jitters: week1JittersId,
  tryhackmeVsHtb: tryhackmeVsHtbId,
  resumeReview: resumeReviewId,
  certsVsDegrees: certsVsDegreesId,
};

export const mockThreads: Thread[] = [
  {
    id: codeOfConductId,
    title: "Community Guidelines — please read before posting",
    categoryId: CATEGORY_IDS.general,
    authorId: USER_IDS.admin,
    createdAt: "2025-08-01T00:00:00Z",
    pinned: true,
    locked: false,
    replyCount: 0,
    lastActivityAt: "2025-08-01T00:00:00Z",
  },
  {
    id: secPlusPassedId,
    title: "Passed Security+ on the first try — here's what worked",
    categoryId: CATEGORY_IDS.certs,
    authorId: USER_IDS.jake,
    createdAt: "2026-04-22T13:14:00Z",
    pinned: false,
    locked: false,
    replyCount: 17,
    lastActivityAt: "2026-04-23T19:02:00Z",
  },
  {
    id: wiresharkLabId,
    title: "Anyone else struggling with the Wireshark lab in Module 4?",
    categoryId: CATEGORY_IDS.labs,
    authorId: USER_IDS.sara,
    createdAt: "2026-04-20T17:33:00Z",
    pinned: false,
    locked: false,
    replyCount: 11,
    lastActivityAt: "2026-04-22T21:18:00Z",
  },
  {
    id: internshipsCuId,
    title: "Internship opportunities at local credit unions?",
    categoryId: CATEGORY_IDS.career,
    authorId: USER_IDS.devon,
    createdAt: "2026-04-18T11:22:00Z",
    pinned: false,
    locked: false,
    replyCount: 8,
    lastActivityAt: "2026-04-21T14:55:00Z",
  },
  {
    id: cysaStudyGroupId,
    title: "Study group forming for CySA+ — meeting Thursdays",
    categoryId: CATEGORY_IDS.certs,
    authorId: USER_IDS.devon,
    createdAt: "2026-04-16T09:00:00Z",
    pinned: false,
    locked: false,
    replyCount: 23,
    lastActivityAt: "2026-04-23T20:41:00Z",
  },
  {
    id: laptopSpecsId,
    title: "What laptop specs did you get for the program?",
    categoryId: CATEGORY_IDS.general,
    authorId: USER_IDS.marcus,
    createdAt: "2026-04-14T18:44:00Z",
    pinned: false,
    locked: false,
    replyCount: 14,
    lastActivityAt: "2026-04-22T16:10:00Z",
  },
  {
    id: week1JittersId,
    title: "First-week jitters — anyone else feeling overwhelmed?",
    categoryId: CATEGORY_IDS.general,
    authorId: USER_IDS.priya,
    createdAt: "2026-04-12T20:17:00Z",
    pinned: false,
    locked: false,
    replyCount: 19,
    lastActivityAt: "2026-04-20T13:02:00Z",
  },
  {
    id: tryhackmeVsHtbId,
    title: "TryHackMe vs Hack The Box for a beginner — which one first?",
    categoryId: CATEGORY_IDS.labs,
    authorId: USER_IDS.marcus,
    createdAt: "2026-04-10T12:05:00Z",
    pinned: false,
    locked: false,
    replyCount: 6,
    lastActivityAt: "2026-04-15T22:33:00Z",
  },
  {
    id: resumeReviewId,
    title: "Resume review — first cybersecurity-focused version",
    categoryId: CATEGORY_IDS.career,
    authorId: USER_IDS.sara,
    createdAt: "2026-04-08T14:00:00Z",
    pinned: false,
    locked: false,
    replyCount: 3,
    lastActivityAt: "2026-04-10T11:20:00Z",
  },
  {
    id: certsVsDegreesId,
    title: "Certs vs four-year degree — how did you decide?",
    categoryId: CATEGORY_IDS.alumni,
    authorId: USER_IDS.jake,
    createdAt: "2026-04-02T08:45:00Z",
    pinned: false,
    locked: false,
    replyCount: 12,
    lastActivityAt: "2026-04-19T09:30:00Z",
  },
];

export function getAllThreads(): Thread[] {
  return mockThreads.filter((t) => !t.deletedAt);
}

export function getThreadsByCategory(categoryId: string): Thread[] {
  return mockThreads.filter(
    (t) => t.categoryId === categoryId && !t.deletedAt,
  );
}

export function getThreadById(id: string): Thread | undefined {
  return mockThreads.find((t) => t.id === id && !t.deletedAt);
}
