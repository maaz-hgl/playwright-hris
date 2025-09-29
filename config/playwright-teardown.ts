

// import fs from "fs";
// import path from "path";
// import { spawn } from "child_process";
// import getPort from "get-port";
// import fetch from "node-fetch";
// import { sendTestReportEmail } from "../utils/sendReportViaEmail";
// import { config } from "../config/config";
// import readline from "readline";

// interface TeamsMessage {
//   summary: string;
//   reportUrl?: string;
// }

// function askQuestion(query: string): Promise<string> {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   return new Promise((resolve) =>
//     rl.question(query, (ans) => {
//       rl.close();
//       resolve(ans.trim());
//     })
//   );
// }

// // --- Function to send Teams message ---
// async function sendTeamsMessage({ summary, reportUrl }: TeamsMessage) {
//   const token = config.teams.graphAccessToken!;
//   const teamChatIDSin = process.env.TEAMS_CHAT_ID;

//   if (!token || !teamChatIDSin) {
//     console.warn("GRAPH_ACCESS_TOKEN or TEAMS_CHAT_ID is missing. Skipping Teams 1:1 notification.");
//     return;
//   }

//   try {
//     const messageBody = {
//       body: {
//         contentType: "html",
//         content: summary + (reportUrl ? `<br><a href="${reportUrl}"></a>` : ""),
//       },
//     };

//     const res = await fetch(
//       `https://graph.microsoft.com/v1.0/chats/${teamChatIDSin}/messages`,
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

//     function walkSuite(suite: any, parentTitles: string[] = []) {
//       const currentPath = [...parentTitles, suite.title].filter(Boolean);

//       suite.specs?.forEach((spec: any) => {
//         spec.tests?.forEach((test: any) => {
//           total++;
//           const status = test.results?.[0]?.status;
//           if (status === "passed") passed++;
//           else {
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
//     const port = await getPort({ port: Array.from({ length: 1001 }, (_, i) => 55000 + i) });
//     const server = spawn("npx", ["http-server", reportPath, "-p", port.toString()], {
//       stdio: "inherit",
//       shell: true,
//     });

//     await new Promise((resolve) => setTimeout(resolve, 2000)); // wait server
//     const reportUrl = `http://localhost:${port}/index.html`;

//     const startTime = new Date(report.startTime || Date.now()).toLocaleString();
//     const skipped = report.skipped || 0;
//     const flaky = report.flaky || 0;

//     // --- Teams HTML (auto send) ---
//     const teamsSummaryHtml = `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #fafafa;">
//   <h2>Automation Test Report</h2>
//   <h3>Project: HRIS</h3>
//   <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
//     <tr><th>Metric</th><th>Value</th></tr>
//     <tr><td>Test Start Time</td><td>${startTime}</td></tr>
//     <tr><td>Total Tests</td><td>${total}</td></tr>
//     <tr><td>Passed</td><td style="color: green;">${passed} (${((passed/total)*100).toFixed(2)}%)</td></tr>
//     <tr><td>Skipped</td><td style="color: orange;">${skipped} (${((skipped/total)*100).toFixed(2)}%)</td></tr>
//     <tr><td>Failed</td><td style="color: red;">${failed} (${((failed/total)*100).toFixed(2)}%)</td></tr>
//     <tr><td>Flaky</td><td>${flaky} (0.00%)</td></tr>
//   </table>
//   <p>Full report: <a href="${reportUrl}">Click Here</a></p>
//   <p>Regards,<br/>Automation Team</p>
// </div>
// `;

//     // --- Email HTML ---
//     const emailSummaryHtml = `
// <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f4f6f8; border-radius: 10px;">
//   <h2 style="text-align:center; color:#2C3E50; margin-bottom:5px;">📊 Automation Test Report</h2>
//   <p style="text-align:center; color:#7D3C98; font-size:14px; margin-top:0;">Generated on: <strong>${startTime}</strong></p>

//   <table cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0; text-align:center; border-collapse: collapse;">
//     <tr>
//       <td style="width:25%; padding:5px;">
//         <table cellpadding="0" cellspacing="0" width="100%" style="background:#ecf0f1; border-radius:8px;">
//           <tr><td style="padding:15px;">
//             <p style="margin:0; font-size:20px; color:#34495E;">${total}</p>
//             <p style="margin:0; color:#7F8C8D;">📝 Total</p>
//           </td></tr>
//         </table>
//       </td>
//       <td style="width:25%; padding:5px;">
//         <table cellpadding="0" cellspacing="0" width="100%" style="background:#d4edda; border-radius:8px;">
//           <tr><td style="padding:15px;">
//             <p style="margin:0; font-size:20px; color:green;">${passed}</p>
//             <p style="margin:0; color:#155724;">✅ Passed</p>
//           </td></tr>
//         </table>
//       </td>
//       <td style="width:25%; padding:5px;">
//         <table cellpadding="0" cellspacing="0" width="100%" style="background:#fff3cd; border-radius:8px;">
//           <tr><td style="padding:15px;">
//             <p style="margin:0; font-size:20px; color:#856404;">${skipped}</p>
//             <p style="margin:0; color:#856404;">⚠️ Skipped</p>
//           </td></tr>
//         </table>
//       </td>
//       <td style="width:25%; padding:5px;">
//         <table cellpadding="0" cellspacing="0" width="100%" style="background:#f8d7da; border-radius:8px;">
//           <tr><td style="padding:15px;">
//             <p style="margin:0; font-size:20px; color:red;">${failed}</p>
//             <p style="margin:0; color:#721c24;">❌ Failed</p>
//           </td></tr>
//         </table>
//       </td>
//     </tr>
//   </table>

//   <div style="text-align:center; margin-top:20px;">
//     <a href="${reportUrl}" style="display:inline-block; background:#1F618D; color:white; padding:12px 25px; border-radius:6px; text-decoration:none; font-weight:bold;">🔗 View Full HTML Report</a>
//   </div>

//   <p style="text-align:center; color:#7F8C8D; margin-top:25px;">Regards,<br/>Automation Team</p>
// </div>
// `;

//     // 4️⃣ Send Teams (auto)
//     await sendTeamsMessage({ summary: teamsSummaryHtml, reportUrl });

//     // 5️⃣ Ask user if they want to send email
//     const sendMailAnswer = await askQuestion("Do you want to send the test report email? (yes/no): ");
//     if (sendMailAnswer.toLowerCase() === "yes") {
//       const recipientsInput = await askQuestion("Enter recipient emails (comma separated): ");
//       const recipients = recipientsInput.split(",").map((r) => r.trim()).filter(Boolean);
//       if (recipients.length > 0) {
//         for (const recipient of recipients) {
//           await sendTestReportEmail(recipient, { total, passed, failed, failedTests }, reportUrl, emailSummaryHtml);
//           console.log(`✅ Test report sent to ${recipient}`);
//         }
//       } else {
//         console.log("❌ No valid emails entered. Skipping sending email.");
//       }
//     } else {
//       console.log("ℹ️ Email sending skipped by user.");
//     }

//     console.log("✅ Global Teardown finished.");
//   } catch (err) {
//     console.error("❌ Error in globalTeardown:", err);
//   }
// }


import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import getPort from "get-port";
import fetch from "node-fetch";
import readline from "readline";
import { sendTestReportEmail } from "../utils/sendReportViaEmail";
import { config } from "../config/config";

// --- Interfaces ---
interface TeamsMessage {
  summary: string;
  reportUrl?: string;
}

interface TemplateReplacements {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  startTime: string;
  reportUrl: string;
  passedPercent: string;
  failedPercent: string;
  skippedPercent: string;
  flaky: number;
}

interface TestSuite {
  title: string;
  specs?: { title: string; tests?: { title: string; results?: { status: string }[] }[] }[];
  suites?: TestSuite[];
}

// --- Utils ---
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function sendTeamsMessage({ summary, reportUrl }: TeamsMessage) {
  const token = config.teams.graphAccessToken!;
  const teamChatID = process.env.TEAMS_CHAT_ID;

  if (!token || !teamChatID) {
    console.warn("GRAPH_ACCESS_TOKEN or TEAMS_CHAT_ID is missing. Skipping Teams notification.");
    return;
  }

  try {
    const messageBody = {
      body: {
        contentType: "html",
        content: summary + (reportUrl ? `<br><a href="${reportUrl}"></a>` : ""),
      },
    };

    const res = await fetch(`https://graph.microsoft.com/v1.0/chats/${teamChatID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageBody),
    });

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

function replacePlaceholders(template: string, replacements: TemplateReplacements) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = (replacements as any)[key];
    return value !== undefined ? value.toString() : "";
  });
}

// --- Main teardown ---
export default async function globalTeardown() {
  try {
    const jsonReportPath = path.join(process.cwd(), "reports/result.json");
    if (!fs.existsSync(jsonReportPath)) {
      console.warn("No JSON report found at", jsonReportPath);
      return;
    }

    const report = JSON.parse(fs.readFileSync(jsonReportPath, "utf-8"));

    // Aggregate results
    let total = 0,
      passed = 0,
      failed = 0;
    const failedTests: string[] = [];
    const skipped = report.skipped || 0;
    const flaky = report.flaky || 0;

    function walkSuite(suite: TestSuite, parentTitles: string[] = []) {
      const currentPath = [...parentTitles, suite.title].filter(Boolean);

      suite.specs?.forEach(spec => {
        spec.tests?.forEach(test => {
          total++;
          const status = test.results?.[0]?.status;
          if (status === "passed") passed++;
          else {
            failed++;
            const testName = [...currentPath, spec.title, test.title].filter(Boolean).join(" › ");
            failedTests.push(testName || "Unnamed Test");
          }
        });
      });

      suite.suites?.forEach(child => walkSuite(child, currentPath));
    }

    (report.suites as TestSuite[] | undefined)?.forEach(suite => walkSuite(suite));

    // Serve HTML report
    const reportPath = path.join(process.cwd(), "reports/my-reports");
    const port = await getPort({ port: Array.from({ length: 1001 }, (_, i) => 55000 + i) });
    const server = spawn("npx", ["http-server", reportPath, "-p", port.toString()], {
      stdio: "inherit",
      shell: true,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const reportUrl = `http://localhost:${port}/index.html`;
    const startTime = new Date(report.startTime || Date.now()).toLocaleString();

    // Load templates
    const teamsTemplate = fs.readFileSync(path.join(__dirname, "../templates/teamsSummary.html"), "utf-8");
    const emailTemplate = fs.readFileSync(path.join(__dirname, "../templates/emailSummary.html"), "utf-8");

    const replacements: TemplateReplacements = {
      total,
      passed,
      failed,
      skipped,
      startTime,
      reportUrl,
      passedPercent: ((passed / total) * 100).toFixed(2),
      failedPercent: ((failed / total) * 100).toFixed(2),
      skippedPercent: ((skipped / total) * 100).toFixed(2),
      flaky,
    };

    const teamsHtml = replacePlaceholders(teamsTemplate, replacements);
    const emailHtml = replacePlaceholders(emailTemplate, replacements);

    // Send Teams message
    await sendTeamsMessage({ summary: teamsHtml, reportUrl });

    // Ask for email
    const sendEmailAns = (await askQuestion("Do you want to send email? (yes/no): ")).toLowerCase();
    if (sendEmailAns === "yes") {
      const emailToInput = await askQuestion("Enter recipient emails (comma separated): ");
      const recipients = emailToInput.split(",").map(e => e.trim()).filter(Boolean);

      for (const recipient of recipients) {
        try {
          await sendTestReportEmail(recipient, { total, passed, failed, failedTests }, reportUrl, emailHtml);
          console.log(`✅ Email sent successfully to ${recipient}`);
        } catch (err) {
          console.error(`❌ Failed to send email to ${recipient}:`, err);
        }
      }
    }
  } catch (err) {
    console.error("❌ Error in globalTeardown:", err);
  }
}
