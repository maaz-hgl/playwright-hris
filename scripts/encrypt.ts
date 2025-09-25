import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export function encrypt(value: string, key: string) {
  if (key.length !== 64) {
    throw new Error("SECRET_KEY must be 64 hex characters (32 bytes).");
  }

  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  let encrypted = cipher.update(value, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

// Example usage from command line
if (process.argv[2] === "encrypt" && process.argv[3]) {
  const secretKey = process.env.SECRET_KEY!;
  if (!secretKey) throw new Error("Set SECRET_KEY in your environment.");

  const encryptedValue = encrypt(process.argv[3], secretKey);
  console.log("Encrypted value:", encryptedValue);
}
