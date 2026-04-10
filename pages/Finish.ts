import { Page, Locator, expect } from "@playwright/test";
export class FinishPage {
  private readonly page: Page;
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator(".complete-header");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async assertSuccessMessage(expectedHeader: string) {
    await expect(this.completeHeader).toHaveText(expectedHeader);
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
