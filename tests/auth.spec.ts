import { test, expect } from '../fixtures/fixtures';
import { testData } from '../data/testData';

test.describe('🔐 Authentication (Login) - Core Foundation', () => {

    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
    });

    test('Valid username + valid password → login success', async ({ loginPage, page }) => {
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('Invalid username + valid password → proper error', async ({ loginPage }) => {
        await loginPage.login('invalid_user', testData.validUser.password);
        await loginPage.assertErrorMessage(testData.errorMessages.wrongCredentials);
    });

    test('Valid username + invalid password → proper error', async ({ loginPage }) => {
        await loginPage.login(testData.validUser.username, 'wrong_password');
        await loginPage.assertErrorMessage(testData.errorMessages.wrongCredentials);
    });


    test('Empty username + password → validation message', async ({ loginPage }) => {
        await loginPage.login('', testData.validUser.password);
        await loginPage.assertErrorMessage(testData.errorMessages.usernameRequired);
    });

    test('Username filled, password empty → validation message', async ({ loginPage }) => {
        await loginPage.login(testData.validUser.username, '');
        await loginPage.assertErrorMessage(testData.errorMessages.passwordRequired);
    });

    test('Locked_out_user → correct lock message', async ({ loginPage }) => {
        await loginPage.login(testData.lockedUser.username, testData.lockedUser.password);
        await loginPage.assertErrorMessage(testData.errorMessages.lockedOut);
    });

    test('Error message disappears after retry/close', async ({ loginPage }) => {
        await loginPage.login('', '');
        await loginPage.assertErrorMessage(testData.errorMessages.usernameRequired);
        await loginPage.closeErrorMessage();
        await loginPage.assertErrorMessageNotVisible();
    });

    test('Password field is masked', async ({ loginPage }) => {
        await loginPage.assertPasswordMasked();
    });
});