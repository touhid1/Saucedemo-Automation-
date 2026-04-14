import { Page, Locator, expect } from "@playwright/test";

// This class represents the Login page of the application, providing methods to interact with the login form, handle error messages, and assert various conditions related to the login process.
export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;
// The constructor initializes the locators for the username input, password input, login button, error message, and error close button based on their respective data-test attributes or class names.
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator(".error-button");
  }
  async navigate() {
    await this.page.goto("/");
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
  }
  async login(username: string, password: string) {
    if (username !== null) await this.usernameInput.fill(username);
    if (password !== null) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
// The login method fills in the username and password fields (if they are not null) and clicks the login button to attempt to log in to the application.
  async clearInputs() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
// The clearInputs method clears the text from both the username and password input fields, allowing for a fresh start before entering new credentials.
  async closeErrorMessage() {
    await this.errorCloseButton.click();
  }
  async assertErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }
// The assertErrorMessage method checks that the error message is visible and contains the expected text, which is useful for verifying that the correct error messages are displayed for various login failure scenarios.
  async assertErrorMessageNotVisible() {
    await expect(this.errorMessage).not.toBeVisible();
  }
  async assertPasswordMasked() {
    const type = await this.passwordInput.getAttribute("type");
    expect(type).toBe("password");
  }
}
