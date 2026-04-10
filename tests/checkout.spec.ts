import { test, expect } from "../fixtures/fixtures";
import { testData } from "../data/testData";

test.describe("💳 Checkout Flow – High Value Automation", () => {
  test.beforeEach(async ({ page, sidebarPage }) => {
    await page.goto("/inventory.html");
    await sidebarPage.resetAppState();
    await page.reload();
  });

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

    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await finishPage.assertSuccessMessage("Thank you for your order!");

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

    await checkoutPage.fillInformation("", "", "");
    await checkoutPage.assertErrorMessage(
      testData.errorMessages.firstNameRequired,
    );

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

    await checkoutPage.cancel();
    await expect(page).toHaveURL(/.*cart.html/);

    await cartPage.checkout();
    await checkoutPage.fillInformation("J", "D", "1");
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
