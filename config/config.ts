import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Safe decrypt function
function decryptSafe(encrypted?: string, secretKey?: string): string {
  if (!encrypted) return "";
  if (!secretKey) throw new Error("SECRET_KEY is missing in env");
  const [ivHex, encryptedHex] = encrypted.split(":");
  if (!ivHex || !encryptedHex) return "";
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}

// Secret key from environment
const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in environment");
}

export const config = {
  baseURL: process.env.BASE_URL,

  signUpTitle: process.env.SIGNUP_TITLE,
  signup: {
    firstName: process.env.SIGNUP_FIRST_NAME,
    lastName: process.env.SIGNUP_LAST_NAME,
    password: process.env.SIGNUP_PASS,
    emailPrefix: process.env.SIGNUP_EMAIL_PREFIX,
    existingEmail: process.env.EXISTING_EMAIL,
  },

  loginUser: {
    email: decryptSafe(process.env.Login_Email_ENCRYPTED, secretKey),
    password: decryptSafe(process.env.Login_Password_ENCRYPTED, secretKey),
  },

  newUser: {
    firstName: process.env.SIGNUP_FIRST_NAME,
    lastName: process.env.SIGNUP_LAST_NAME,
    emailPrefix: "maaz.test",
    password: "Password123!",
    role: "admin",
  },

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5433", 10),
    database: decryptSafe(process.env.DB_DATABASE_NAME_ENCRYPTED, secretKey),
    user: process.env.DB_USER,
    password: decryptSafe(process.env.DB_PASSWORD_ENCRYPTED, secretKey),
  },

  email: {
    user: decryptSafe(process.env.EMAIL_USER, secretKey),
    pass: decryptSafe(process.env.EMAIL_PASS, secretKey),
    to: process.env.EMAIL_TO,
  },

  teams: {
    webhookUrl: decryptSafe(process.env.TEAMS_WEBHOOK_URL, secretKey),
    chatId: process.env.TEAMS_CHAT_ID,
    groupId: process.env.TEAMS_GROUP_ID,
    teamId: process.env.TEAMS_TEAM_ID,
    channelId: process.env.TEAMS_CHANNEL_ID,
    graphAccessToken: decryptSafe(process.env.GRAPH_ACCESS_TOKEN_ENCRYPTED, secretKey),
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureTenantId: process.env.AZURE_TENANT_ID,
  },
};
