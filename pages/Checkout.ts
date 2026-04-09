import { Page, Locator, expect } from '@playwright/test';
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

    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        if (firstName !== null) await this.firstNameInput.fill(firstName);
        if (lastName !== null) await this.lastNameInput.fill(lastName);
        if (postalCode !== null) await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
    async assertCalculations() {
        const subtotalText = await this.subtotalLabel.textContent();
        const taxText = await this.taxLabel.textContent();
        const totalText = await this.totalLabel.textContent();

        const subtotal = parseFloat(subtotalText?.split('$')[1] || '0');
        const tax = parseFloat(taxText?.split('$')[1] || '0');
        const total = parseFloat(totalText?.split('$')[1] || '0');

        expect(subtotal + tax).toBeCloseTo(total, 2);
    }

    async assertSubtotal(expectedSubtotal: number) {
        const subtotalText = await this.subtotalLabel.textContent();
        const subtotal = parseFloat(subtotalText?.split('$')[1] || '0');
        expect(subtotal).toBe(expectedSubtotal);
    }

    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedMessage);
    }
}