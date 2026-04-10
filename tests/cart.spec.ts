import { test, expect } from "../fixtures/fixtures";
import { testData } from "../data/testData";

test.describe("🧺 Cart – Detailed Interactions & Edge Cases", () => {
  test.beforeEach(async ({ page, sidebarPage }) => {
    await page.goto("/inventory.html");

    await sidebarPage.resetAppState();
    await page.reload();
  });

  test("Add single and multiple products → Badge updates correctly", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe("1");

    await inventoryPage.addItemToCart(testData.products.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe("2");
  });

  test("Remove product from inventory page → Badge updates immediately", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe("1");

    await inventoryPage.removeItemFromCart(testData.products.backpack);
    expect(await inventoryPage.getCartCount()).toBe("0");
  });

  test("Cart page shows correct items, price and persists refresh", async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    const item = testData.products.jacket;
    await inventoryPage.addItemToCart(item);
    await inventoryPage.goToCart();

    await cartPage.assertItemInCart(item);

    await page.reload();
    await cartPage.assertItemInCart(item);
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test("Remove item from cart page works", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();

    await cartPage.removeItem(testData.products.backpack);
    await cartPage.assertCartEmpty();
  });

  test("Continue shopping button works", async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Cart state is maintained when navigating back from details", async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.navigateToItemDetails(testData.products.bikeLight);
    await page.locator('[data-test="back-to-products"]').click();
    expect(await inventoryPage.getCartCount()).toBe("1");
  });

  test("Add item from details page works", async ({ inventoryPage, page }) => {
    await inventoryPage.navigateToItemDetails(testData.products.onesie);
    await page.locator('[data-test="add-to-cart"]').click();
    expect(await inventoryPage.getCartCount()).toBe("1");
  });
});
