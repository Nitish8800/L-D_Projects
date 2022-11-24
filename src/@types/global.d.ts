namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    SMPT_HOST: string;
    MONGO_URI: string;
    SMPT_PORT: string;
    SMPT_MAIL: string;
    JWT_SECRET: string;
    SMPT_SERVICE: string;
    SMPT_PASSWORD: string;
    CLIENT_BASE_URL: string;
  }
}
