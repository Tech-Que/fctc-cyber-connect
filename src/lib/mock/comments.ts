import { nanoid } from "nanoid";
import type { Comment } from "@/types";
import { USER_IDS } from "./users";
import { POST_IDS } from "./posts";

const newId = () => `comment_${nanoid(8)}`;

export const mockComments: Comment[] = [
  {
    id: newId(),
    postId: POST_IDS.secPlus,
    authorId: USER_IDS.devon,
    body: "Congrats! How long did you study total? I'm shooting for June and trying to gauge the runway.",
    createdAt: "2026-04-22T15:08:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.secPlus,
    authorId: USER_IDS.sara,
    body: "Seconding Professor Messer. His notes PDF is also gold if you prefer reading over watching.",
    createdAt: "2026-04-22T18:42:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.secPlus,
    authorId: USER_IDS.marcus,
    body: "Saving this post. Which PBQ types did you feel least prepared for?",
    createdAt: "2026-04-23T08:15:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.wireshark,
    authorId: USER_IDS.devon,
    body: "The credentials in that PCAP are on a different port — check the tcp.stream in packet 47.",
    createdAt: "2026-04-20T20:11:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.wireshark,
    authorId: USER_IDS.jake,
    body: "Devon's right — Module 4 intentionally throws you off the standard port to force you to look at stream content rather than port numbers. Good habit to build.",
    createdAt: "2026-04-21T09:40:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.internships,
    authorId: USER_IDS.jake,
    body: "VyStar's security team is small but they take interns. I interned there in 2023. Reach out to their IT recruiting inbox around February.",
    createdAt: "2026-04-19T11:05:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.cysa,
    authorId: USER_IDS.sara,
    body: "I'm in. Will bring a whiteboard and snacks.",
    createdAt: "2026-04-16T11:22:00Z",
  },
  {
    id: newId(),
    postId: POST_IDS.laptop,
    authorId: USER_IDS.jake,
    body: "I used a Lenovo T14 with 32GB and an i7 — never ran out of headroom. If you can swing 32GB it makes running multiple VMs painless. 16GB works but you'll feel the ceiling in Module 6.",
    createdAt: "2026-04-15T09:50:00Z",
  },
];

export function getCommentsByPost(postId: string): Comment[] {
  return mockComments.filter((c) => c.postId === postId && !c.deletedAt);
}
