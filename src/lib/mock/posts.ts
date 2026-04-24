import type { Post } from "@/types";
import { USER_IDS } from "./users";
import { THREAD_IDS } from "./threads";

export const POST_IDS = {
  secPlus: "post_secplus",
  wireshark: "post_wireshark",
  internships: "post_internships",
  cysa: "post_cysa",
  laptop: "post_laptop",
};

export const mockPosts: Post[] = [
  {
    id: POST_IDS.secPlus,
    threadId: THREAD_IDS.secPlusPassed,
    authorId: USER_IDS.jake,
    body: "Took Security+ last Saturday and passed with a 784. Honestly the thing that helped most was Professor Messer's YouTube series plus running through Jason Dion's practice exams twice — the second pass I drilled only the ones I missed. For anyone nervous: the PBQs are less scary than people say. Read the prompt twice, eliminate obvious wrong answers, move on if stuck and come back.",
    createdAt: "2026-04-22T13:14:00Z",
  },
  {
    id: POST_IDS.wireshark,
    threadId: THREAD_IDS.wiresharkLab,
    authorId: USER_IDS.sara,
    body: "I'm stuck on filtering the HTTP POST requests in the capture file. I can get tcp.port==80 to narrow things down but the filter for the login credentials just returns nothing. Is the capture supposed to have cleartext HTTP traffic? Starting to think I'm looking at the wrong PCAP.",
    createdAt: "2026-04-20T17:33:00Z",
  },
  {
    id: POST_IDS.internships,
    threadId: THREAD_IDS.internshipsCu,
    authorId: USER_IDS.devon,
    body: "Heard VyStar and 121 Financial both take interns periodically. Anyone have a point of contact or know when they post? I've got my Security+ scheduled for next month and would love to line something up for summer.",
    createdAt: "2026-04-18T11:22:00Z",
  },
  {
    id: POST_IDS.cysa,
    threadId: THREAD_IDS.cysaStudyGroup,
    authorId: USER_IDS.devon,
    body: "Putting together a weekly study group for CySA+. Thinking Thursday evenings 6-8pm in the lab, first meeting next week. I've got the official CompTIA study guide and some practice questions from Dion; happy to share with whoever joins. Reply or DM if interested and I'll send the shared calendar invite.",
    createdAt: "2026-04-16T09:00:00Z",
  },
  {
    id: POST_IDS.laptop,
    threadId: THREAD_IDS.laptopSpecs,
    authorId: USER_IDS.marcus,
    body: "Starting in the fall and trying to decide on a laptop. The program page says 16GB RAM minimum but doesn't specify CPU or storage. Anyone here tell me what they actually use day-to-day? Planning to run VMs for the labs so want to make sure I'm not underpowered.",
    createdAt: "2026-04-14T18:44:00Z",
  },
];

export function getPostsByThread(threadId: string): Post[] {
  return mockPosts.filter((p) => p.threadId === threadId && !p.deletedAt);
}

export function getPostById(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id && !p.deletedAt);
}
