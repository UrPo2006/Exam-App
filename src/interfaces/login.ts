
export interface UserResponse {
  id: string; 
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  role: string;
}

export interface SuccessLoginResponse {
  status: boolean;
  code: number;
  payload: {
    user: UserResponse;
    token: string;
  };
}
export interface FailLoginResponse{
        statusMsg: string,
    message: string
}