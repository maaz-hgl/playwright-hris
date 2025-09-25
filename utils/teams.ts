import fetch from "node-fetch";
import {config} from "../config/config"

type TeamsMessageOptions = {
  content: string;
  chatId?: string;          // For 1:1 or group chat messages
  teamId?: string;          // For sending to a team channel
  channelId?: string;       // Required if teamId is set
};

export async function sendTeamsMessage(options: TeamsMessageOptions) {
  const { content, chatId, teamId, channelId } = options;

  if (!chatId && (!teamId || !channelId)) {
    throw new Error("❌ You must provide either chatId or both teamId and channelId");
  }

  let url = "";
  if (chatId) {
    url = `https://graph.microsoft.com/v1.0/chats/${chatId}/messages`;
  } else {
    url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.teams.graphAccessToken!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: {
        content,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`❌ Failed to send Teams message: ${res.status} ${err}`);
  }

  console.log("✅ Teams message sent successfully!");
}



// import { config } from "../config/config";
// import fetch from "node-fetch";

// type TeamsMessageOptions = {
//   content: string;
//   chatId?: string;          // For 1:1 or group chat messages
//   teamId?: string;          // For sending to a team channel
//   channelId?: string;       // Required if teamId is set
// };

// export async function sendTeamsMessage(options: TeamsMessageOptions) {
//   const { content, chatId, teamId, channelId } = options;

//   if (!chatId && (!teamId || !channelId)) {
//     throw new Error("❌ You must provide either chatId or both teamId and channelId");
//   }

//   const url = chatId
//     ? `https://graph.microsoft.com/v1.0/chats/${chatId}/messages`
//     : `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`;

//   const token = config.teams.graphAccessToken;
//   if (!token) {
//     throw new Error("❌ GRAPH_ACCESS_TOKEN is missing or not decrypted!");
//   }

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ body: { content } }),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`❌ Failed to send Teams message: ${res.status} ${err}`);
//   }

//   console.log("✅ Teams message sent successfully!");
// }
