

// import fs from "fs";
// import path from "path";
// import { spawn } from "child_process";
// import getPort from "get-port";
// import fetch from "node-fetch";
// import { sendTestReportEmail } from "../utils/sendReportViaEmail";

// interface TeamsMessage {
//   summary: string;
//   reportUrl?: string;
// }

// // --- Function to send Teams message to a channel ---
// async function sendTeamsMessage({ summary, reportUrl }: TeamsMessage) {
//   const token = process.env.GRAPH_ACCESS_TOKEN;
//   const teamId = process.env.TEAMS_TEAM_ID;
//   const channelId = process.env.TEAMS_CHANNEL_ID;

//   if (!token || !teamId || !channelId) {
//     console.warn(
//       "GRAPH_ACCESS_TOKEN, TEAMS_TEAM_ID, or TEAMS_CHANNEL_ID is missing. Skipping Teams notification."
//     );
//     return;
//   }

//   try {
//     const messageBody = {
//       body: {
//         contentType: "html",
//         content:
//           summary +
//           (reportUrl ? `<br><a href="${reportUrl}">Open Report</a>` : ""),
//       },
//     };

//     const res = await fetch(
//       `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(messageBody),
//       }
//     );

//     if (!res.ok) {
//       const err = await res.text();
//       console.error(`❌ Failed to send Teams message: ${res.status} ${err}`);
//     } else {
//       console.log("✅ Teams message sent successfully!");
//     }
//   } catch (err) {
//     console.error("❌ Error sending Teams message:", err);
//   }
// }

// // --- Global Teardown ---
// export default async function globalTeardown() {
//   try {
//     // 1️⃣ Read JSON report
//     const jsonReportPath = path.join(process.cwd(), "reports/result.json");
//     if (!fs.existsSync(jsonReportPath)) {
//       console.warn("No JSON report found at", jsonReportPath);
//       return;
//     }
//     const report = JSON.parse(fs.readFileSync(jsonReportPath, "utf-8"));

//     // 2️⃣ Aggregate test results
//     let total = 0,
//       passed = 0,
//       failed = 0;
//     const failedTests: string[] = [];

//     // Recursive function to extract failed test names with hierarchy
//     function walkSuite(suite: any, parentTitles: string[] = []) {
//       const currentPath = [...parentTitles, suite.title].filter(Boolean);

//       suite.specs?.forEach((spec: any) => {
//         spec.tests?.forEach((test: any) => {
//           total++;
//           const status = test.results?.[0]?.status;
//           if (status === "passed") {
//             passed++;
//           } else if (status === "failed") {
//             failed++;
//             const testName = [...currentPath, spec.title, test.title]
//               .filter(Boolean)
//               .join(" › ");
//             failedTests.push(testName || "Unnamed Test");
//           }
//         });
//       });

//       suite.suites?.forEach((child: any) => walkSuite(child, currentPath));
//     }

//     report.suites?.forEach((suite: any) => walkSuite(suite));

//     // 3️⃣ Serve HTML report
//     const reportPath = path.join(process.cwd(), "reports/my-reports");
//     const ports = Array.from({ length: 1001 }, (_, i) => 55000 + i);
//     const port = await getPort({ port: ports });
//     const server = spawn(
//       "npx",
//       ["http-server", reportPath, "-p", port.toString()],
//       { stdio: "inherit", shell: true }
//     );

//     await new Promise((resolve) => setTimeout(resolve, 2000)); // wait server

//     const reportUrl = `http://localhost:${port}/index.html`;

//     // 4️⃣ Build summary
//     let summary = `Playwright Test Report<br>✅ Total: ${total}, Passed: ${passed}, ❌ Failed: ${failed}`;
//     if (failed > 0)
//       summary += `<br><br>❌ Failed Tests:<br>- ${failedTests.join("<br>- ")}`;

//     // 5️⃣ Send Teams message to channel
//     await sendTeamsMessage({ summary, reportUrl });

//     // 6️⃣ Send report via Email
//     try {
//       console.log("📧 Sending test report via email...");
//       await sendTestReportEmail("maaz.hagalwadi570@gmail.com", {
//         total,
//         passed,
//         failed,
//         failedTests,
//       });
//       console.log("✅ Test report email sent successfully!");
//     } catch (emailErr) {
//       console.error("❌ Failed to send test report email:", emailErr);
//     }

//     console.log("✅ Global Teardown finished. Reports sent.");

//     // Optional: stop server after a while
//     // setTimeout(() => server.kill(), 10000);
//   } catch (err) {
//     console.error("❌ Error in globalTeardown:", err);
//   }
// }


import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import getPort from "get-port";
import fetch from "node-fetch";
import { sendTestReportEmail } from "../utils/sendReportViaEmail";
import {config} from "../config/config";

interface TeamsMessage {
  summary: string;
  reportUrl?: string;
}

// --- Function to send Teams message to a channel ---
async function sendTeamsMessage({ summary, reportUrl }: TeamsMessage) {
  const token = config.teams.graphAccessToken!;
  const teamId = process.env.TEAMS_TEAM_ID;
  const channelId = process.env.TEAMS_CHANNEL_ID;

  if (!token || !teamId || !channelId) {
    console.warn(
      "GRAPH_ACCESS_TOKEN, TEAMS_TEAM_ID, or TEAMS_CHANNEL_ID is missing. Skipping Teams notification."
    );
    return;
  }

  try {
    const messageBody = {
      body: {
        contentType: "html",
        content: summary + (reportUrl ? `<br><a href="${reportUrl}"></a>` : ""),
      },
    };

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ Failed to send Teams message: ${res.status} ${err}`);
    } else {
      console.log("✅ Teams message sent successfully!");
    }
  } catch (err) {
    console.error("❌ Error sending Teams message:", err);
  }
}

// --- Global Teardown ---
export default async function globalTeardown() {
  try {
    // 1️⃣ Read JSON report
    const jsonReportPath = path.join(process.cwd(), "reports/result.json");
    if (!fs.existsSync(jsonReportPath)) {
      console.warn("No JSON report found at", jsonReportPath);
      return;
    }
    const report = JSON.parse(fs.readFileSync(jsonReportPath, "utf-8"));

    // 2️⃣ Aggregate test results
    let total = 0,
      passed = 0,
      failed = 0;
    const failedTests: string[] = [];

    // Recursive function to extract failed test names with hierarchy
    function walkSuite(suite: any, parentTitles: string[] = []) {
      const currentPath = [...parentTitles, suite.title].filter(Boolean);

      suite.specs?.forEach((spec: any) => {
        spec.tests?.forEach((test: any) => {
          total++;
          const status = test.results?.[0]?.status;
          if (status === "passed") {
            passed++;
          } else if (status === "failed") {
            failed++;
            const testName = [...currentPath, spec.title, test.title]
              .filter(Boolean)
              .join(" › ");
            failedTests.push(testName || "Unnamed Test");
          }
        });
      });

      suite.suites?.forEach((child: any) => walkSuite(child, currentPath));
    }

    report.suites?.forEach((suite: any) => walkSuite(suite));

    // 3️⃣ Serve HTML report
    const reportPath = path.join(process.cwd(), "reports/my-reports");
    const ports = Array.from({ length: 1001 }, (_, i) => 55000 + i);
    const port = await getPort({ port: ports });
    const server = spawn(
      "npx",
      ["http-server", reportPath, "-p", port.toString()],
      { stdio: "inherit", shell: true }
    );

    await new Promise((resolve) => setTimeout(resolve, 2000)); // wait server
    const reportUrl = `http://localhost:${port}/index.html`;

    // 4️⃣ Build summary in Teams/Email friendly format
    const summaryHtml = `
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 10px;">
  <h2 style="text-align: center;">Playwright Test Report Summary</h2>
  <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
  <p><strong>Total Test Cases:</strong> ${total}</p>
  <p style="color: green;"><strong>✅ Passed:</strong> ${passed}</p>
  <p style="color: red;"><strong>❌ Failed:</strong> ${failed}</p>

  ${
    failed > 0
      ? `<h2 style="margin-top: 20px;">Failed Test Cases:</h3>
         <ul style="margin-left: 20px; line-height: 2;">
           ${failedTests.map((t) => `<li>${t}</li>`).join("")}
         </ul>`
      : `<p style="color: green; margin-top: 20px;">All tests passed successfully! ✅</p>`
  }

  <p style="margin-top: 20px; text-align: center;">
    🔗 <a href="${reportUrl}" style="color: #1F618D; font-weight: bold;">View Full HTML Report</a>
  </p>
</div>
`;


    // 5️⃣ Send Teams message
    await sendTeamsMessage({ summary: summaryHtml, reportUrl });

    // 6️⃣ Send Email
    try {
      console.log("📧 Sending test report via email...");
      await sendTestReportEmail(
        "maaz.hagalwadi570@gmail.com",
        {
          total,
          passed,
          failed,
          failedTests,
        },
        reportUrl
      );
      console.log("✅ Test report email sent successfully!");
    } catch (emailErr) {
      console.error("❌ Failed to send test report email:", emailErr);
    }

    console.log("✅ Global Teardown finished. Reports sent.");

    // Optional: stop server after a while
    // setTimeout(() => server.kill(), 10000);
  } catch (err) {
    console.error("❌ Error in globalTeardown:", err);
  }
}
