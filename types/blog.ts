export interface BlogPost {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: 'workshop' | 'offline-course' | 'community';
  categoryLabel: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    role?: string;
  };
  thumbnail?: string;
  tags: string[];
  readingTime?: string;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  sortBy?: 'latest' | 'popular' | 'most-viewed';
  page?: number;
  limit?: number;
}

export interface BlogComment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes?: number;
  replies?: BlogComment[];
}

export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string;
  category: string;
  publishedAt: string;
}



export interface Creator {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  status: string;
  categoryId: string;
  creatorId: string;
  type: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  creator: Creator;
  category: Category;
  tags: string[];
}

export interface BlogsResponse {
  status: string;
  message: string;
  data: {
    blogs: BlogItem[];
  };
}

export interface BlogDetailResponse {
  status: string;
  message: string;
  data: {
    status: string;
    data: BlogItem;
  };
}

export type BlogType = "HOITHAO" | "OFFLINE" | "CONGDONG";