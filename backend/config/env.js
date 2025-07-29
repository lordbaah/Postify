import dotenv from 'dotenv';
import path from 'path';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const ENV = {
  NodeEnv: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  // MAIL_TRAP_HOST: process.env.MAIL_TRAP_HOST,
  // MAIL_TRAP_PORT: process.env.MAIL_TRAP_PORT,
  // MAIL_TRAP_USERNAME: process.env.MAIL_TRAP_USERNAME,
  // MAIL_TRAP_PASSWORD: process.env.MAIL_TRAP_PASSWORD,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  MAILJET_HOST: process.env.MAILJET_HOST,
  MAILJET_PORT: process.env.MAILJET_PORT,
  MAILJET_API_KEY: process.env.MAILJET_API_KEY,
  MAILJET_SECRET_KEY: process.env.MAILJET_SECRET_KEY,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
};

export default ENV;
