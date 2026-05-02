export interface SignUpRequest {
   username: string,
    firstName: string,
    lastName: string,
  // email: string;
  phone: string;
}

export interface SignUpResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
    role: string;
}
