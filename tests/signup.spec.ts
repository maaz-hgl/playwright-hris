import { test, expect } from "@playwright/test";
import { SignUpPage, SignUpData } from "../Pages/SignUpPage";
import { LoginPage } from "../Pages/LoginPage";
import { config } from "../config/config";
import { activateUser, deleteUser } from "../utils/db";
import { generateUniqueEmail } from "../utils/email";

test.describe("User Authentication Flow", () => {
  let signUpEmail: string;


  test.describe("Positive Scenarios", () => {
    test("Signup → DB Activation → Login", async ({ page }) => {
      signUpEmail = generateUniqueEmail(config.signup.emailPrefix!);
      const signUpPage = new SignUpPage(page);
      const loginPage = new LoginPage(page);

      const userData: SignUpData = {
        firstName: config.signup.firstName!,
        lastName: config.signup.lastName!,
        email: signUpEmail,
        password: config.signup.password!,
      };

      await signUpPage.goto();
      await signUpPage.expectSignUpPageVisible();
      await signUpPage.fillForm(userData);
      await signUpPage.clickSignUp();

      await activateUser(signUpEmail);

      await page.goto(`${config.baseURL}/login`);
      await loginPage.fillEmail(signUpEmail);
      await loginPage.fillPassword(config.signup.password!);
      await loginPage.clickLogin();
      await loginPage.expectDashboardVisible();
    });

    test.afterEach(async () => {
      if (signUpEmail) {
        await deleteUser(signUpEmail);
        signUpEmail = "";
      }
    });
  });


  test.describe("Negative Scenarios", () => {
    test("Signup with already existing email should fail", async ({ page }) => {
      const signUpPage = new SignUpPage(page);

      const existingUser: SignUpData = {
        firstName: "Existing",
        lastName: "User",
        email: config.signup.existingEmail!, // From config
        password: config.signup.password!,
      };

      await signUpPage.goto();
      await signUpPage.fillForm(existingUser);
      // Skip waiting for URL because signup should fail
      await signUpPage.clickSignUp(false);

      const alert = page.locator('div[role="alert"]').first();
      await expect(alert).toHaveText(/An error occurred during registration/i);
    });

    test("Signup with invalid email should fail", async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      const invalidUser: SignUpData = {
        firstName: "Test",
        lastName: "User",
        email: "invalid-email",
        password: "Password123!",
      };

      await signUpPage.goto();
      await signUpPage.fillForm(invalidUser);

      const emailInput = page.getByLabel(/Email[:*]?/i);
      const signUpBtn = page.getByRole("button", { name: /sign ?up/i });

      await signUpBtn.click();

      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toMatch(/include an '@' in the email/i);
    });
  });
});
