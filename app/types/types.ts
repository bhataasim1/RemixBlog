export type Posts = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  featuredImage: string;
  imageUrl: string;

  userId: string;
};

export type FilterTodos = "all" | "pending" | "completed" | "dueDate";

export type ErrorType = {
  title?: string;
  content?: string;
  // featuredImage?: File | string;
}

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export type AddPost = Pick<Posts, "title" | "content" | 'author' | "featuredImage" | 'imageUrl' | 'userId'>;
export type Collection = "Post";

export type LogoutMode = 'json' | 'cookie' | 'session';