export interface ICreateUser {
  username: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}


export interface IUserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}