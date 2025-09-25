import { Page, expect } from "@playwright/test";
import { config } from "../config/config";

export class DashboardPage {
  constructor(private page: Page) {}

  private userIcon() {
    return this.page.getByRole('button', { name: '' });
  }

  async goToUserPage() {
    const userIcon = this.userIcon();
    await expect(userIcon).toBeVisible();
    await Promise.all([
      this.page.waitForURL("**/user", { timeout: 60000 }), // adjust if actual path differs
      userIcon.click(),
    ]);
    await expect(this.page).toHaveURL(`${config.baseURL}/user`);
  }

  async expectUserPageVisible() {
    await expect(this.page).toHaveURL(`${config.baseURL}/user`);
    await expect(this.page.getByRole("heading", { name: /user/i })).toBeVisible({ timeout: 10000 });
  }
}
