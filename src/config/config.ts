import dotenv from "dotenv";

dotenv.config();

export const env = process.env;
export const {
  PORT,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  FRONTEND_URL,
  BASE_PATH,
  NODE_ENV,
} = env;

const whitelist = [FRONTEND_URL, "http://localhost:3000"]; // Add more as needed

// Define CORS options
export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(console.log("Not allowed by CORS:", origin));
    }
  }, // Allow only your frontend to access the API
  credentials: true, // Allow credentials (e.g., cookies) to be sent
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
