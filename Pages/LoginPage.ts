import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async fillEmail(email: string) {
    const emailInput = this.page.getByLabel(/Email[:*]?/i);
    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
  }

  async fillPassword(password: string) {
    const passwordInput = this.page.getByLabel(/Password[:*]?/i);
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);
  }

  async clickLogin(shouldSucceed = true) {
  const loginBtn = this.page.getByRole("button", { name: /Log In/i });
  await expect(loginBtn).toBeVisible();

  if (shouldSucceed) {
    await Promise.all([
      this.page.waitForURL("**/dashboard", { timeout: 60000 }),
      loginBtn.click(),
    ]);
  } else {
    await loginBtn.click(); 
  }
}
  async expectDashboardVisible() {
    const heading = this.page.getByRole("heading", { name: "Recruitment Dashboard" });
    await expect(heading).toBeVisible({ timeout: 10000 });
  }
}
