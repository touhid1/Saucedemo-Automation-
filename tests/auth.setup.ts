import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/Login";
import { testData } from "../data/testData";

// This setup file will run before all tests and authenticate the user, saving the authentication state to a file.
const authFile = "playwright/.auth/user.json";
// You can run this setup file with the command: npx playwright test --setup=tests/auth.setup.ts
setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(
    testData.validUser.username,
    testData.validUser.password,
  );
// Verify login was successful before saving the state
  await expect(page).toHaveURL(/.*inventory.html/);
// Save the authenticated state to a file for reuse in tests
  await page.context().storageState({ path: authFile });
});
