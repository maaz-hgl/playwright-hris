import { config } from "dotenv";
import { PublicClientApplication } from "@azure/msal-node";

config(); // load .env

if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_TENANT_ID) {
  throw new Error("CLIENT_ID and TENANT_ID must be defined in .env");
}

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID!}`,
  },
};

const pca = new PublicClientApplication(msalConfig);

const deviceCodeRequest = {
  scopes: ["Chat.ReadWrite", "User.Read"],
  deviceCodeCallback: (response: any) => {
    console.log(response.message); // shows code + URL
  },
};

async function getToken() {
  const response = await pca.acquireTokenByDeviceCode(deviceCodeRequest);
  if (!response) throw new Error("❌ Failed to acquire token");

  console.log("Access Token:", response.accessToken);
}

getToken();
