
export interface IProfileRoot {
  status: boolean;
  code: number;
  payload: IProfilePayload;
}

export interface IProfilePayload {
  user: IUser;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}