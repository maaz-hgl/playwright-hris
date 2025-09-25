import { Page, expect } from "@playwright/test";
import { config } from "../config/config";

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class SignUpPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(`${config.baseURL}/signUp`);
  }

  async expectSignUpPageVisible() {
    const heading = this.page.getByRole("heading", { name: config.signUpTitle });
    await expect(heading).toBeVisible({ timeout: 10000 });
  }

  async fillForm({ firstName, lastName, email, password }: SignUpData) {
  const fields = [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Email", value: email },
    { label: "Password", value: password },
  ];

  for (const { label, value } of fields) {
    const input = this.page.getByLabel(new RegExp(`${label}[:*]?`, "i"));
    await expect(input).toBeVisible();
    await input.fill(value);
  }
}

  async clickSignUp(expectRedirect = true) {
    const signUpBtn = this.page.getByRole("button", { name: /sign ?up/i });
    await expect(signUpBtn).toBeVisible();
    signUpBtn.click();

     await signUpBtn.click();

  if (expectRedirect) {
    await this.page.waitForURL("**/login", { timeout: 40000 });
    await expect(this.page).toHaveURL("/login");
  }
  }
}
