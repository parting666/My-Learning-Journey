// --- API 交互类型 ---

export interface News {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string; // 后端返回的 ISO 格式日期字符串
}

export interface RegisterRequest {
  username?: string;
  password?: string;

}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export type AuthToken = string;

// --- Context 状态类型 ---

export interface AuthContextType {
  token: AuthToken | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
