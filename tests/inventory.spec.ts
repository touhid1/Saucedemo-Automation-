import { test, expect } from "../fixtures/fixtures";
import { testData } from "../data/testData";

test.describe("🛒 Product Listing – Real Business Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory.html");
  });

  test("Products load successfully with correct count and details", async ({
    inventoryPage,
  }) => {
    await inventoryPage.assertInventoryCount(6);
    await inventoryPage.assertAllItemsHaveDetails();
  });

  test("Product sorting: Name (A → Z)", async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption("az");
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test("Product sorting: Name (Z → A)", async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption("za");
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test("Product sorting: Price (Low → High)", async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption("lohi");
    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("Product sorting: Price (High → Low)", async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption("hilo");
    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test("Navigation to item details and back works", async ({
    inventoryPage,
    page,
  }) => {
    const product = testData.products.backpack;
    await inventoryPage.navigateToItemDetails(product);
    await expect(page).toHaveURL(/.*inventory-item.html/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
      product,
    );

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
