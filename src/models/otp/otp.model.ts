export interface IOtp {
  email: string;
  otpCode: string;
  expireIn: Date;
}

export interface IOtpCreate extends IOtp {}
