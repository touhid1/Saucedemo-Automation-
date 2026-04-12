import { Page, Locator, expect } from "@playwright/test";
// This class represents the Checkout page of the application, providing methods to fill in user information, complete the checkout process, and assert calculations and error messages.
export class CheckoutPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
// The constructor initializes the locators for the various input fields, buttons, and labels on the checkout page based on the page object passed in.
  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }
// Method to fill in the user information fields (first name, last name, postal code) and click the continue button to proceed with the checkout process.
  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    if (firstName !== null) await this.firstNameInput.fill(firstName);
    if (lastName !== null) await this.lastNameInput.fill(lastName);
    if (postalCode !== null) await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
// Method to click the finish button to complete the checkout process.
  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
  // Method to assert that the displayed subtotal, tax, and total calculations are correct by parsing the text content of the respective labels and comparing the sum of subtotal and tax to the total.
  async assertCalculations() {
    const subtotalText = await this.subtotalLabel.textContent();
    const taxText = await this.taxLabel.textContent();
    const totalText = await this.totalLabel.textContent();
// Extract the numeric values from the text content and convert them to floats for comparison.
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    const tax = parseFloat(taxText?.split("$")[1] || "0");
    const total = parseFloat(totalText?.split("$")[1] || "0");

    expect(subtotal + tax).toBeCloseTo(total, 2);
  }
// Method to assert that the displayed subtotal matches the expected value by parsing the text content of the subtotal label and comparing it to the expected subtotal.
  async assertSubtotal(expectedSubtotal: number) {
    const subtotalText = await this.subtotalLabel.textContent();
    const subtotal = parseFloat(subtotalText?.split("$")[1] || "0");
    expect(subtotal).toBe(expectedSubtotal);
  }
// Method to assert that the displayed tax matches the expected value by parsing the text content of the tax label and comparing it to the expected tax.
  async assertErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }
}
