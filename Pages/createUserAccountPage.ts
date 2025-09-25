import { Page, expect } from "@playwright/test";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export class UserPage {
  constructor(private page: Page) {}

  async expectUserPageVisible() {
    await expect(this.page.getByRole("heading", { name: "Create User Account" })).toBeVisible();
  }

  async fillUserForm(user: UserData) {
    const fields = [
      { name: "firstName", value: user.firstName },
      { name: "lastName", value: user.lastName },
      { name: "email", value: user.email },
      { name: "password", value: user.password },
    ];

    for (const { name, value } of fields) {
      const input = this.page.locator(`input[name="${name}"]`);
      await expect(input).toBeVisible();
      await input.evaluate((el, val) => (el as HTMLInputElement).value = val, value);
    }

    const roleSelect = this.page.locator('select[name="role"]');
    await this.page.waitForFunction(
      selector => (document.querySelector(selector) as HTMLSelectElement)?.options.length > 1,
      'select[name="role"]'
    );
    await roleSelect.selectOption({ label: user.role });
  }

  async clickCreateAccount() {
    const createBtn = this.page.getByRole("button", { name: "Create Account" });
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    const successAlert = this.page.locator('div[role="alert"]');
    
  }
}
