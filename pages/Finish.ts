import { Page, Locator, expect } from "@playwright/test";

// This class represents the Finish page of the application, providing methods to assert the success message and navigate back to the products page.
export class FinishPage {
  private readonly page: Page;
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;
// The constructor initializes the locators for the complete header and back home button based on the page object passed in.
  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator(".complete-header");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }
// Method to assert that the displayed success message matches the expected header text by checking the text content of the complete header locator.
  async assertSuccessMessage(expectedHeader: string) {
    await expect(this.completeHeader).toHaveText(expectedHeader);
  }
// Method to navigate back to the products page by clicking the back home button.
  async backHome() {
    await this.backHomeButton.click();
  }
}
