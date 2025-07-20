export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  //   author: User;
  category: Category;
  tags: string[];
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  commentsCount: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  tags: string[];
  bannerImage?: File;
}
