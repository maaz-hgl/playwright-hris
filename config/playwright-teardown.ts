// // import fs from "fs";
// // import path from "path";
// // import { spawn } from "child_process";
// // import getPort from "get-port";
// // import fetch from "node-fetch";
// // import readline from "readline";
// // import { sendTestReportEmail } from "../utils/sendReportViaEmail";
// // import { config } from "../config/config";

// // // --- Interfaces ---
// // interface TeamsMessage {
// //   summary: string;
// //   reportUrl?: string;
// // }

// // interface TemplateReplacements {
// //   total: number;
// //   passed: number;
// //   failed: number;
// //   skipped: number;
// //   startTime: string;
// //   reportUrl: string;
// //   passedPercent: string;
// //   failedPercent: string;
// //   skippedPercent: string;
// //   flaky: number;
// // }

// // interface TestSuite {
// //   title: string;
// //   specs?: { title: string; tests?: { title: string; results?: { status: string }[] }[] }[];
// //   suites?: TestSuite[];
// // }

// // // --- Utils ---
// // function askQuestion(query: string): Promise<string> {
// //   const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout,
// //   });
// //   return new Promise(resolve =>
// //     rl.question(query, ans => {
// //       rl.close();
// //       resolve(ans.trim());
// //     })
// //   );
// // }

// // async function sendTeamsMessage({ summary, reportUrl }: TeamsMessage) {
// //   const token = config.teams.graphAccessToken!;
// //   const teamChatID = process.env.TEAMS_CHAT_ID;

// //   if (!token || !teamChatID) {
// //     console.warn("GRAPH_ACCESS_TOKEN or TEAMS_CHAT_ID is missing. Skipping Teams notification.");
// //     return;
// //   }

// //   try {
// //     const messageBody = {
// //       body: {
// //         contentType: "html",
// //         content: summary + (reportUrl ? `<br><a href="${reportUrl}"></a>` : ""),
// //       },
// //     };

// //     const res = await fetch(`https://graph.microsoft.com/v1.0/chats/${teamChatID}/messages`, {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(messageBody),
// //     });

// //     if (!res.ok) {
// //       const err = await res.text();
// //       console.error(`❌ Failed to send Teams message: ${res.status} ${err}`);
// //     } else {
// //       console.log("✅ Teams message sent successfully!");
// //     }
// //   } catch (err) {
// //     console.error("❌ Error sending Teams message:", err);
// //   }
// // }

// // function replacePlaceholders(template: string, replacements: TemplateReplacements) {
// //   return template.replace(/\$\{(\w+)\}/g, (_, key) => {
// //     const value = (replacements as any)[key];
// //     return value !== undefined ? value.toString() : "";
// //   });
// // }

// // // --- Main teardown ---
// // export default async function globalTeardown() {
// //   try {
// //     const jsonReportPath = path.join(process.cwd(), "reports/result.json");
// //     if (!fs.existsSync(jsonReportPath)) {
// //       console.warn("No JSON report found at", jsonReportPath);
// //       return;
// //     }

// //     const report = JSON.parse(fs.readFileSync(jsonReportPath, "utf-8"));

// //     // Aggregate results
// //     let total = 0,
// //       passed = 0,
// //       failed = 0;
// //     const failedTests: string[] = [];
// //     const skipped = report.skipped || 0;
// //     const flaky = report.flaky || 0;

// //     function walkSuite(suite: TestSuite, parentTitles: string[] = []) {
// //       const currentPath = [...parentTitles, suite.title].filter(Boolean);

// //       suite.specs?.forEach(spec => {
// //         spec.tests?.forEach(test => {
// //           total++;
// //           const status = test.results?.[0]?.status;
// //           if (status === "passed") passed++;
// //           else {
// //             failed++;
// //             const testName = [...currentPath, spec.title, test.title].filter(Boolean).join(" › ");
// //             failedTests.push(testName || "Unnamed Test");
// //           }
// //         });
// //       });

// //       suite.suites?.forEach(child => walkSuite(child, currentPath));
// //     }

// //     (report.suites as TestSuite[] | undefined)?.forEach(suite => walkSuite(suite));

// //     // Serve HTML report
// //     const reportPath = path.join(process.cwd(), "reports/my-reports");
// //     const port = await getPort({ port: Array.from({ length: 1001 }, (_, i) => 55000 + i) });
// //     const server = spawn("npx", ["http-server", reportPath, "-p", port.toString()], {
// //       stdio: "inherit",
// //       shell: true,
// //     });

// //     await new Promise(resolve => setTimeout(resolve, 2000));
// //     const reportUrl = `http://localhost:${port}/index.html`;
// //     const startTime = new Date(report.startTime || Date.now()).toLocaleString();

// //     // Load templates
// //     const teamsTemplate = fs.readFileSync(path.join(__dirname, "../templates/teamsSummary.html"), "utf-8");
// //     const emailTemplate = fs.readFileSync(path.join(__dirname, "../templates/teamsSummary.html"), "utf-8");

// //     const replacements: TemplateReplacements = {
// //       total,
// //       passed,
// //       failed,
// //       skipped,
// //       startTime,
// //       reportUrl,
// //       passedPercent: ((passed / total) * 100).toFixed(2),
// //       failedPercent: ((failed / total) * 100).toFixed(2),
// //       skippedPercent: ((skipped / total) * 100).toFixed(2),
// //       flaky,
// //     };

// //     const teamsHtml = replacePlaceholders(teamsTemplate, replacements);
// //     const emailHtml = replacePlaceholders(teamsTemplate, replacements);

// //     // Send Teams message
// //     await sendTeamsMessage({ summary: teamsHtml, reportUrl });

// //     // Ask for email
// //     const sendEmailAns = (await askQuestion("Do you want to send email? (yes/no): ")).toLowerCase();
// //     if (sendEmailAns === "yes") {
// //       const emailToInput = await askQuestion("Enter recipient emails (comma separated): ");
// //       const recipients = emailToInput.split(",").map(e => e.trim()).filter(Boolean);

// //      for (const recipient of recipients) {
// //         try {
// //           await sendTestReportEmail(recipient, { total, passed, failed, failedTests }, reportUrl, emailHtml);
// //           console.log(`✅ Email sent successfully to ${recipient}`);
// //         } catch (err) {
// //           console.error(`❌ Failed to send email to ${recipient}:`, err);
// //         }
// //       } 
// //     }
// //   } catch (err) {
// //     console.error("❌ Error in globalTeardown:", err);
// //   }
// // }




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
        content: summary + (reportUrl ? `<br><a href="${reportUrl}">View Report</a>` : ""),
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
    const emailTemplate = fs.readFileSync(path.join(__dirname, "../templates/teamsSummary.html"), "utf-8");

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

    // --- Email handling ---
    let shouldSendEmail = false;
    let recipients: string[] = [];

    if (process.env.JENKINS_HOME) {
      // ✅ Jenkins: automated control via env
      shouldSendEmail = process.env.SEND_EMAIL === "true";
      if (process.env.EMAIL_TO) {
        recipients = process.env.EMAIL_TO.split(",").map(e => e.trim());
      }
      console.log(`[CI] SEND_EMAIL=${process.env.SEND_EMAIL}, Recipients=${recipients}`);
    } else {
      // ✅ Local: ask interactively
      const sendEmailAns = (await askQuestion("Do you want to send email? (yes/no): ")).toLowerCase();
      if (sendEmailAns === "yes") {
        const emailToInput = await askQuestion("Enter recipient emails (comma separated): ");
        recipients = emailToInput.split(",").map(e => e.trim()).filter(Boolean);
        shouldSendEmail = recipients.length > 0;
      }
    }

    if (shouldSendEmail && recipients.length > 0) {
      for (const recipient of recipients) {
        try {
          await sendTestReportEmail(recipient, { total, passed, failed, failedTests }, reportUrl, emailHtml);
          console.log(`✅ Email sent successfully to ${recipient}`);
        } catch (err) {
          console.error(`❌ Failed to send email to ${recipient}:`, err);
        }
      }
    } else {
      console.log("📭 Skipping email notification.");
    }
  } catch (err) {
    console.error("❌ Error in globalTeardown:", err);
  }
}

