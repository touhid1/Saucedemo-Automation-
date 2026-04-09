import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly errorCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorCloseButton = page.locator('.error-button');
    }
    async navigate() {
        await this.page.goto('/');
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }
    async login(username: string, password: string) {
        if (username !== null) await this.usernameInput.fill(username);
        if (password !== null) await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async clearInputs() {
        await this.usernameInput.clear();
        await this.passwordInput.clear();
    }

    async closeErrorMessage() {
        await this.errorCloseButton.click();
    }
    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    async assertErrorMessageNotVisible() {
        await expect(this.errorMessage).not.toBeVisible();
    }
    async assertPasswordMasked() {
        const type = await this.passwordInput.getAttribute('type');
        expect(type).toBe('password');
    }
}