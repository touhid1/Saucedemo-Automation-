import { Page, Locator, expect } from "@playwright/test";

// This class represents the Cart page of the application, providing methods to interact with cart items and perform actions like checkout or continue shopping.
export class CartPage {
  private readonly page: Page;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
// The constructor initializes the locators for cart items, checkout button, and continue shopping button based on the page object passed in.
  constructor(page: Page) {
    this.page = page;
    // Note: Items in cart use the same inventory-item data-test as the shop page.
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
  }
// Method to remove an item from the cart by its name, locating the item and clicking the remove button.
  async removeItem(itemName: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    await item.locator('button[data-test^="remove"]').click();
  }
// Method to proceed to checkout by clicking the checkout button.
  async checkout() {
    await this.checkoutButton.click();
  }
// Method to continue shopping by clicking the continue shopping button.
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
  async assertItemInCart(itemName: string, expectedPrice?: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item).toBeVisible();
    if (expectedPrice) {
      await expect(
        item.locator('[data-test="inventory-item-price"]'),
      ).toHaveText(expectedPrice);
    }
  }
// Method to assert that the cart is empty by checking that there are no cart items visible.
  async assertCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }
// Method to get the count of items currently in the cart by counting the cart item locators.
  async getItemCount() {
    return await this.cartItems.count();
  }
  async assertCheckoutButtonState(enabled: boolean) {
    if (enabled) {
      await expect(this.checkoutButton).toBeEnabled();
    }
  }
}
