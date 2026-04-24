export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface Thread {
  id: string;
  title: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  pinned: boolean;
  locked: boolean;
  replyCount: number;
  lastActivityAt: string;
  deletedAt?: string | null;
}

export interface Post {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  createdAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  deletedAt?: string | null;
}
