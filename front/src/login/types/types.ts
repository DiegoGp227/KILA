export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  userInfo: {
    id: number;
    name: string;
    email: string;
  };
}
