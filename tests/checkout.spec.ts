import { test, expect } from "../fixtures/fixtures";
import { testData } from "../data/testData";

// This test suite focuses on the checkout flow, covering both happy paths and edge cases related to user input and pricing integrity.
test.describe("💳 Checkout Flow – High Value Automation", () => {
  test.beforeEach(async ({ page, sidebarPage }) => {
    await page.goto("/inventory.html");
    await sidebarPage.resetAppState();
    await page.reload();
  });
// Happy Path: Valid user info and successful checkout
  test("Checkout with valid user info → Full flow success", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    finishPage,
    page,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.addItemToCart(testData.products.onesie);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await checkoutPage.fillInformation(
      testData.checkoutInfo.firstName,
      testData.checkoutInfo.lastName,
      testData.checkoutInfo.postalCode,
    );

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.assertCalculations(); // Validating math (Price + Tax = Total)
    await checkoutPage.finish();
// After finishing, we should be on the complete page with a success message
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await finishPage.assertSuccessMessage("Thank you for your order!");
// The cart should be empty after a successful checkout
    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
    ).not.toBeVisible();
  });

  test("Checkout validation for missing fields", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();
// Attempt to continue with empty fields
    await checkoutPage.fillInformation("", "", "");
    await checkoutPage.assertErrorMessage(
      testData.errorMessages.firstNameRequired,
    );
// Fill only first name and attempt to continue
    await checkoutPage.fillInformation("John", "", "12345");
    await checkoutPage.assertErrorMessage(
      testData.errorMessages.lastNameRequired,
    );
  });

  test("Pricing integrity: Item total = sum of individual item prices", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.addItemToCart(testData.products.bikeLight);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation("J", "D", "1");
// The backpack is $29.99 and the bike light is $9.99, so the subtotal should be $39.98
    await checkoutPage.assertSubtotal(39.98);
    await checkoutPage.assertCalculations();
  });

  test("Cancel checkout from step one or two works", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();
// Cancel from step one
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/.*cart.html/);
//  Start checkout again and cancel from step two
    await cartPage.checkout();
    await checkoutPage.fillInformation("J", "D", "1");
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
