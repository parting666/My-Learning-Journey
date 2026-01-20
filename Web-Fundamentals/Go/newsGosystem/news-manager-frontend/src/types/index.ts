export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
}
export interface NewsAdd { 
  Title: string;
  Content: string; 
}
export interface ApiResponse<T> {
  data: T;
}

export interface AuthData {
  token: string;
  user: User;
}