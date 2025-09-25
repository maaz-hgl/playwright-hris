import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export function decrypt(encrypted: string, key: string) {
  if (key.length !== 64) {
    throw new Error("SECRET_KEY must be 64 hex characters (32 bytes).");
  }

  const [ivHex, encryptedHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}

// Example usage from command line
if (process.argv[2] === "decrypt" && process.argv[3]) {
  const secretKey = process.env.SECRET_KEY!;
  if (!secretKey) throw new Error("Set SECRET_KEY in your environment.");

  const decryptedValue = decrypt(process.argv[3], secretKey);
  console.log("Decrypted value:", decryptedValue);
}
