import { test, expect } from "../fixtures/fixtures";
import { testData } from "../data/testData";

// This test suite focuses on regression testing of critical user flows, stability under rapid interactions, and ensuring that the application handles state changes gracefully without breaking. It includes a smoke test for the entire purchase flow, as well as tests for keyboard interactions and rapid add/remove actions in the cart.
test.describe("🔁 Regression, Stability & State Abuse", () => {
  test("End-to-end happy path regression (Smoke Test)", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    finishPage,
    page,
  }) => {
    await page.goto("/inventory.html");
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation("Global", "User", "00000");
    await checkoutPage.finish();
    await finishPage.assertSuccessMessage("Thank you for your order!");
  });
// Testing that pressing the Enter key submits the login form and successfully logs in the user, ensuring that keyboard interactions are properly handled.
  test("Enter key submits login form", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page
      .locator('[data-test="username"]')
      .fill(testData.validUser.username);
    await page
      .locator('[data-test="password"]')
      .fill(testData.validUser.password);
// Pressing Enter should submit the form and log in the user
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Rapid add/remove clicks don't break cart count", async ({
    inventoryPage,
    page,
  }) => {
    await page.goto("/inventory.html");
    const item = testData.products.backpack;
// Rapidly add and remove the same item multiple times
    await inventoryPage.addItemToCart(item);
    await inventoryPage.removeItemFromCart(item);
    await inventoryPage.addItemToCart(item);

    expect(await inventoryPage.getCartCount()).toBe("1");
  });

  test("Keyboard navigation (Tab) through login fields", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page.focus('[data-test="username"]');
// Pressing Tab should move focus to the password field
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-test="password"]')).toBeFocused();
// Pressing Tab again should move focus to the login button
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-test="login-button"]')).toBeFocused();
  });
});
