// import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";
// import {config} from "../config/config"

// interface TestSummary {
//   total: number;
//   passed: number;
//   failed: number;
//   failedTests: string[];
// }

// export async function sendTestReportEmail(to: string, summary: TestSummary, reportUrl?: string) {
//   const reportPath = path.join(process.cwd(), "reports/my-reports/index.html");

//   const htmlContent = fs.existsSync(reportPath)
//     ? fs.readFileSync(reportPath, "utf-8")
//     : "<p>No report found</p>";

//   let summaryHtml = `
//     <h2>Playwright Test Report</h2>
//     <p> Total: ${summary.total}, ✅ Passed: ${summary.passed}, ❌ Failed: ${summary.failed}</p>
//   `;

//   if (summary.failed > 0) {
//     summaryHtml += `
//       <p>❌ Failed Tests:</p>
//       <ul>
//         ${summary.failedTests.map(t => `<li>${t}</li>`).join("\n")}
//       </ul>
//     `;
//   }

//   if (reportUrl) {
//     summaryHtml += `<p>Open full report: <a href="${reportUrl}">Click Here</a></p>`;
//   } else {
//     summaryHtml += `<p>Full report attached as <strong>playwright-report.html</strong></p>`;
//   }

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: config.email.user!,
//       pass: config.email.pass!,
//     },
//   });

//   const mailOptions = {
//     from: config.email.user,
//     to,
//     subject: "Playwright Test Report",
//     html: summaryHtml,
//     attachments: [
//       {
//         filename: "playwright-report.html",
//         path: reportPath,
//       },
//     ],
//   };

//   await transporter.sendMail(mailOptions);

// }






import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { config } from "../config/config";

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  failedTests: string[];
}

/**
 * Sends Playwright test report via email
 * @param to - recipient email
 * @param summary - test summary object
 * @param reportUrl - optional full report URL
 * @param htmlContent - optional HTML content to use instead of default
 */
export async function sendTestReportEmail(
  to: string,
  summary: TestSummary,
  reportUrl?: string,
  htmlContent?: string
) {
  // Default HTML if not provided
  const defaultHtml = `
    <h2>Playwright Test Report</h2>
    <p>Total: ${summary.total}, ✅ Passed: ${summary.passed}, ❌ Failed: ${summary.failed}</p>
    ${
      reportUrl
        ? `<p>Full report: <a href="${reportUrl}">Click Here</a></p>`
        : ""
    }
  `;

  const finalHtml = htmlContent || defaultHtml;

  // Attach full HTML report if exists
  const reportPath = path.join(process.cwd(), "reports/my-reports/index.html");
  const attachments = fs.existsSync(reportPath)
    ? [
        {
          filename: "playwright-report.html",
          path: reportPath,
        },
      ]
    : [];

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user!,
      pass: config.email.pass!,
    },
  });

  // Mail options
  const mailOptions = {
    from: config.email.user,
    to,
    subject: "📊 Playwright Test Report",
    html: finalHtml,
  };

  await transporter.sendMail(mailOptions);
  
}
