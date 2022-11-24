import dotenv from "dotenv";

// Parsing the env file.
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  SMPT_HOST: string | undefined;
  SMPT_PORT: number | undefined;
  SMPT_MAIL: string | undefined;
  JWT_SECRET: string | undefined;
  JWT_EXPIRES: string | undefined;
  SMPT_SERVICE: string | undefined;
  SMPT_PASSWORD: string | undefined;
  CLIENT_BASE_URL: string | undefined;
}

interface Config {
  PORT: number;
  SMPT_PORT: number;
  MONGO_URI: string;
  SMPT_HOST: string;
  SMPT_MAIL: string;
  JWT_SECRET: string;
  JWT_EXPIRES: string;
  SMPT_SERVICE: string;
  SMPT_PASSWORD: string;
  CLIENT_BASE_URL: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    SMPT_MAIL: process.env.SMPT_MAIL,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES: process.env.JWT_EXPIRES,
    SMPT_SERVICE: process.env.SMPT_SERVICE,
    SMPT_PASSWORD: process.env.SMPT_PASSWORD,
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
    SMPT_HOST: process.env.SMPT_HOST,
    SMPT_PORT: process.env.SMPT_PORT
      ? Number(process.env.SMPT_PORT)
      : undefined,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

// console.log(sanitizedConfig)

export default sanitizedConfig;
