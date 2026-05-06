import { test as baseTest, expect } from '@playwright/test'
import { LoginPage } from '../pages/login_page'
import { ProductPage } from '../pages/product_page'
import { AuthHelper } from '../utils/helper/loginHelper'

type MyFixture = {
  loginPage: LoginPage
  productPage: ProductPage
  auth: AuthHelper
}

export const test = baseTest.extend<MyFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page))
  },

  auth: async ({loginPage}, use)=>{
    const auth = new AuthHelper(loginPage)
    await use(auth)
  }
})

export { expect }