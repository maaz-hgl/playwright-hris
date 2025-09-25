import { test } from "@playwright/test";
import { LoginPage } from "../Pages/LoginPage";
import { DashboardPage } from "../Pages/DashboardPage";
import { UserPage, UserData } from "../Pages/createUserAccountPage";
import { config } from "../config/config";
import { generateUniqueEmail } from "../utils/email";

test("Login and create a new user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const userPage = new UserPage(page);

  await page.goto(`${config.baseURL}/login`);
  await loginPage.fillEmail(config.loginUser.email);
  await loginPage.fillPassword(config.loginUser.password);
  await loginPage.clickLogin();
  await loginPage.expectDashboardVisible();

  await dashboardPage.goToUserPage();
  await userPage.expectUserPageVisible();

  const newUserEmail = generateUniqueEmail("user");

  const newUser: UserData = {
    firstName: config.newUser.firstName!,
    lastName: config.newUser.lastName!,
    email: newUserEmail,
    password: config.newUser.password,
    role: config.newUser.role,
  };

  await userPage.fillUserForm(newUser);
  await userPage.clickCreateAccount();
});
