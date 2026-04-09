import { test, expect } from '../fixtures/fixtures';

test.describe('🧭 Navigation & Session Handling', () => {

    test('Logout works and clears session', async ({ sidebarPage, page }) => {
        await page.goto('/inventory.html');
        await sidebarPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');

        await page.goBack();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test.describe('Unauthorized Access', () => {
        test.use({ storageState: { cookies: [], origins: [] } }); // Clean slate

        test('Direct URL access without login redirects to login page', async ({ page }) => {
            await page.goto('https://www.saucedemo.com/inventory.html');
            await expect(page).toHaveURL('https://www.saucedemo.com/');
            await expect(page.locator('[data-test="error"]')).toContainText('You can only access \'/inventory.html\' when you are logged in.');
        });
    });

    test('Menu open/close works consistently and doesn\'t block actions', async ({ sidebarPage, inventoryPage, page }) => {
        await page.goto('/inventory.html');
        await sidebarPage.open();
        await sidebarPage.close();

        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        expect(await inventoryPage.getCartCount()).toBe('1');
    });

    test('Browser back after order completion handles state gracefully', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
        await page.goto('/inventory.html');
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation('J', 'D', '1');
        await checkoutPage.finish();

        await expect(page).toHaveURL(/.*checkout-complete.html/);
        await page.goBack();
        await expect(page).not.toHaveURL(/.*error.*/);
    });
});