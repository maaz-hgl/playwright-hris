// import { test, expect } from "@playwright/test";
// import { LoginPage } from "../Pages/LoginPage";
// import { config } from "../config/config";

// test.describe("Login Tests", () => {

//   test.describe("Positive Tests", () => {
//     test("Login with valid credentials should succeed", async ({ page }) => {
//       const loginPage = new LoginPage(page);
//       await page.goto(`${config.baseURL}/login`);

//       await loginPage.fillEmail(process.env.Login_Email || "");
//       await loginPage.fillPassword(process.env.Login_Password || "");
//       await loginPage.clickLogin();
      
//     });
//   });

//   test.describe("Negative Tests", () => {

//     test("Login with invalid email should fail", async ({ page }) => {
//       const loginPage = new LoginPage(page);
//       await page.goto(`${config.baseURL}/login`);

//       const emailInput = page.getByLabel(/Email[:*]?/i);
//       await emailInput.fill("invalidemail");

//       const loginBtn = page.getByRole("button", { name: /Log In/i });
//       await loginBtn.click();

//       const validationMessage = await emailInput.evaluate(
//         (el: HTMLInputElement) => el.validationMessage
//       );
//       expect(validationMessage).toMatch(/include an '@' in the email/i);
//     });

//     test("Login with empty credentials should fail", async ({ page }) => {
//       const emailInput = page.getByLabel(/Email[:*]?/i);
//       const passwordInput = page.getByLabel(/Password[:*]?/i);

//       await page.goto(`${config.baseURL}/login`);
//       await emailInput.fill("");
//       await passwordInput.fill("");

//       const loginBtn = page.getByRole("button", { name: /Log In/i });
//       await loginBtn.click();

//       const emailValidation = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
//       const passwordValidation = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);

//       expect(emailValidation).toBe("Please fill out this field.");
//       expect(passwordValidation).toBe("Please fill out this field.");
//     });

//     test("Login with wrong password should fail", async ({ page }) => {
//       const loginPage = new LoginPage(page);
//       await page.goto(`${config.baseURL}/login`);

//       await loginPage.fillEmail(process.env.Login_Email || "");
//       await loginPage.fillPassword("WrongPassword123!");

//       // Skip waiting for dashboard because login should fail
//       await loginPage.clickLogin(false);

//       const alert = page.locator('div[role="alert"]').first();
//       await expect(alert).toHaveText(/Invalid password/i);
//     });

//   });
// });


import { test, expect } from "@playwright/test";
import { LoginPage } from "../Pages/LoginPage";
import { config } from "../config/config";

test.describe("Login Tests", () => {

  test.describe("Positive Tests", () => {
    test("Login with valid credentials should succeed", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await page.goto(`${config.baseURL}/login`);

      // Use decrypted credentials from config
      await loginPage.fillEmail(config.loginUser.email);
      await loginPage.fillPassword(config.loginUser.password);
      await loginPage.clickLogin();

      // Optionally verify dashboard or successful login element
      await expect(page).toHaveURL(/dashboard|home/i);
    });
  });

  test.describe("Negative Tests", () => {

    test("Login with invalid email should fail", async ({ page }) => {
      await page.goto(`${config.baseURL}/login`);

      const emailInput = page.getByLabel(/Email[:*]?/i);
      await emailInput.fill("invalidemail");

      const loginBtn = page.getByRole("button", { name: /Log In/i });
      await loginBtn.click();

      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toMatch(/include an '@' in the email/i);
    });

    test("Login with empty credentials should fail", async ({ page }) => {
      await page.goto(`${config.baseURL}/login`);

      const emailInput = page.getByLabel(/Email[:*]?/i);
      const passwordInput = page.getByLabel(/Password[:*]?/i);

      await emailInput.fill("");
      await passwordInput.fill("");

      const loginBtn = page.getByRole("button", { name: /Log In/i });
      await loginBtn.click();

      const emailValidation = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      const passwordValidation = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);

      expect(emailValidation).toBe("Please fill out this field.");
      expect(passwordValidation).toBe("Please fill out this field.");
    });

    test("Login with wrong password should fail", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await page.goto(`${config.baseURL}/login`);

      // Use valid email from config but wrong password
      await loginPage.fillEmail(config.loginUser.email);
      await loginPage.fillPassword("WrongPassword123!");

      await loginPage.clickLogin(false); // skip waiting for dashboard

      const alert = page.locator('div[role="alert"]').first();
      await expect(alert).toHaveText(/Invalid passworddddjkk/i);
    });

  });
});
