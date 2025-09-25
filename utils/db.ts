import { Client } from "pg";
import { config } from "../config/config";

async function getClient() {
  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
  });
  await client.connect();
  return client;
}

export async function activateUser(email: string, role = "admin") {
  const client = await getClient();
  try {
    await client.query(
      `UPDATE "SignUps" 
       SET status = 'active', active = true, role = $2 
       WHERE email = $1`,
      [email, role]
    );
    console.log(`User ${email} activated in DB`);
  } finally {
    await client.end();
  }
}

export async function deleteUser(email: string) {
  const client = await getClient();
  try {
    await client.query(`DELETE FROM "SignUps" WHERE email = $1`, [email]);
    console.log(`User ${email} deleted from DB`);
  } finally {
    await client.end();
  }
}