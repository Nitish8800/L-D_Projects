export interface IUser {
  secretKey?: string;
  active?: boolean;
  phone: number;
  email: string;
  resend?: number;
  expireAt?: Date;
  createdAt?: Date;
}

