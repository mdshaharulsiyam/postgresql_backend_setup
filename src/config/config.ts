import dotenv from "dotenv";
dotenv.config();

export default Object.freeze({
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
});