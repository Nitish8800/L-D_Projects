export interface IUser {
  first_name: string;
  last_name: string;
  secretKey?: string;
  otpauthUrl?: string;
  active?: boolean;
  phone: number;
  email: string;
}
