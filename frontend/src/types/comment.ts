export interface Comment {
  id: string;
  content: string;
  //   author: User;
  blogId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  blogId: string;
}
