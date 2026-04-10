import { Page, Locator, expect } from "@playwright/test";
export class SidebarPage {
  private readonly page: Page;
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly resetLink: Locator;
  private readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
    this.closeMenuButton = page.locator("#react-burger-cross-btn");
  }

  async open() {
    await this.burgerMenuButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async close() {
    await this.closeMenuButton.click();
    await expect(this.logoutLink).not.toBeVisible();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }
  async resetAppState() {
    await this.open();
    await this.resetLink.click();
    await this.close();
  }

  async navigateToAllItems() {
    await this.open();
    await this.allItemsLink.click();
  }
}
