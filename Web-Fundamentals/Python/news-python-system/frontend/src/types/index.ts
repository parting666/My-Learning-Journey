export interface News {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface NewsState {
  news: News[];
  total: number;
  page: number;
  size: number;
  keyword: string;
}