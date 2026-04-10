import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/Login";
import { InventoryPage } from "../pages/Inventory";
import { CartPage } from "../pages/Cart";
import { CheckoutPage } from "../pages/Checkout";
import { FinishPage } from "../pages/Finish";
import { SidebarPage } from "../pages/sidbar";

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  finishPage: FinishPage;
  sidebarPage: SidebarPage;
};

// Extending the base test with our POM objects
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  finishPage: async ({ page }, use) => {
    await use(new FinishPage(page));
  },
  sidebarPage: async ({ page }, use) => {
    await use(new SidebarPage(page));
  },
});

export { expect } from "@playwright/test";
