import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/Login";
import { testData } from "../data/testData";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password,
  );

  await expect(page).toHaveURL(/.*inventory.html/);

  await page.context().storageState({ path: authFile });
});
