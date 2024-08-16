export interface UserDTO {
    id?: number;
    username: string;
    email: string;
    password?: string;  // Optional because it might not be included in responses
    firstName: string;
    lastName: string;
    roles?: string[]; // an array of strings (roles)
  }
  