import { test, expect } from "../fixtures/fixtures";

// This test suite focuses on navigation and session handling, ensuring that logout functionality works correctly, unauthorized access is prevented, and that the menu behaves consistently without blocking user actions. It also tests how the application handles browser navigation after critical actions like order completion.
test.describe("🧭 Navigation & Session Handling", () => {
  test("Logout works and clears session", async ({ sidebarPage, page }) => {
    await page.goto("/inventory.html");
    await sidebarPage.logout();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
// After logout, trying to go back should not return to inventory page
    await page.goBack();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });
// This test ensures that users cannot access protected pages without logging in, and that they receive an appropriate error message if they attempt to do so.
  test.describe("Unauthorized Access", () => {
    test.use({ storageState: { cookies: [], origins: [] } }); // Clean slate
// Attempt to access inventory page directly without logging in
    test("Direct URL access without login redirects to login page", async ({
      page,
    }) => {
      await page.goto("https://www.saucedemo.com/inventory.html");
      await expect(page).toHaveURL("https://www.saucedemo.com/");
      await expect(page.locator('[data-test="error"]')).toContainText(
        "You can only access '/inventory.html' when you are logged in.",
      );
    });
  });

  test("Menu open/close works consistently and doesn't block actions", async ({
    sidebarPage,
    inventoryPage,
    page,
  }) => {
    await page.goto("/inventory.html");
    await sidebarPage.open();
    await sidebarPage.close();
// Try to add an item to cart while menu is open
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe("1");
  });

  test("Browser back after order completion handles state gracefully", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await page.goto("/inventory.html");
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation("J", "D", "1");
    await checkoutPage.finish();
// After finishing, we should be on the checkout complete page with a success message
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await page.goBack();
    await expect(page).not.toHaveURL(/.*error.*/);
  });
});
