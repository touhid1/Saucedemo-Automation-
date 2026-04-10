import { test, expect } from "../fixtures/fixtures";
import { testData } from "../data/testData";

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

  test("Enter key submits login form", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page
      .locator('[data-test="username"]')
      .fill(testData.validUser.username);
    await page
      .locator('[data-test="password"]')
      .fill(testData.validUser.password);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Rapid add/remove clicks don't break cart count", async ({
    inventoryPage,
    page,
  }) => {
    await page.goto("/inventory.html");
    const item = testData.products.backpack;

    await inventoryPage.addItemToCart(item);
    await inventoryPage.removeItemFromCart(item);
    await inventoryPage.addItemToCart(item);

    expect(await inventoryPage.getCartCount()).toBe("1");
  });

  test("Keyboard navigation (Tab) through login fields", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page.focus('[data-test="username"]');

    await page.keyboard.press("Tab");
    await expect(page.locator('[data-test="password"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('[data-test="login-button"]')).toBeFocused();
  });
});
