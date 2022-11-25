export interface IUser {
  firstName: string;
  lastName: string;
  secretKey?: string;
  otpauthUrl?: string;
  isActive?: boolean;
  phone: number;
  email: string;
}
