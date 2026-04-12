import { Page, Locator, expect } from "@playwright/test";
export class InventoryPage {
  private readonly page: Page;
  private readonly headerTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;
  private readonly shoppingCartLink: Locator;
// This class represents the Inventory page of the application, providing methods to interact with inventory items, sort options, and the shopping cart.
  constructor(page: Page) {
    this.page = page;
    this.headerTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
  }
// Method to assert that the Inventory page is displayed by checking the visibility and text content of the header title locator.
  async addItemToCart(itemName: string) {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button[data-test^="add-to-cart"]').click();
  }

  async removeItemFromCart(itemName: string) {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button[data-test^="remove"]').click();
  }

  async getCartCount() {
    if (await this.cartBadge.isVisible()) {
      const count = await this.cartBadge.textContent();
      return count || "0";
    }
    return "0";
  }

  async selectSortOption(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async assertInventoryCount(expectedCount: number) {
    await expect(this.inventoryItems).toHaveCount(expectedCount);
  }
  async assertAllItemsHaveDetails() {
    const items = await this.inventoryItems.all();
    for (const item of items) {
      await expect(
        item.locator('[data-test="inventory-item-name"]'),
      ).not.toBeEmpty();
      await expect(
        item.locator('[data-test="inventory-item-price"]'),
      ).not.toBeEmpty();
// Additionally, we can check that the item image is visible and has a valid source.
      const img = item.locator("img.inventory_item_img");
      await expect(img).toBeVisible();
// Check that the image source is not a placeholder or broken link (this is a basic check and can be enhanced based on actual application behavior).
      const src = await img.getAttribute("src");
      expect(src).not.toContain("sl-404");
    }
  }
  async getItemPrices() {
    const priceElements = await this.page
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    return priceElements.map((p) => parseFloat(p.replace("$", "")));
  }

  async getItemNames() {
    return await this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  async navigateToItemDetails(itemName: string) {
    await this.page.click(
      `[data-test="inventory-item-name"]:has-text("${itemName}")`,
    );
  }
}
