import { test as baseTest, expect } from '@playwright/test'
import { LoginPage } from '../pages/login_page'
import { ProductPage } from '../pages/product_page'
import { FavoritePage } from '../pages/favorite_page'
import { AuthHelper } from '../utils/helper/loginHelper'
import { ProductDetailPage } from '../pages/product_detail_page'
import { CartPage } from '../pages/cart_page'
import { CheckOutInformationPage } from '../pages/CheckoutInformation'
import { CheckoutOverviewPage } from '../pages/CheckOutOverview'

type MyFixture = {
  loginPage: LoginPage
  productPage: ProductPage
  favoritePage: FavoritePage
  productDetailPage: ProductDetailPage
  cartPage:CartPage
  checkoutInformationPage:CheckOutInformationPage
  checkoutOverviewPage: CheckoutOverviewPage
  auth: AuthHelper

}

export const test = baseTest.extend<MyFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page))
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page))
  },

  favoritePage: async ({page}, use) =>{
    await use(new FavoritePage(page))
  },

  cartPage: async ({page},use) =>{
    await use(new CartPage(page))
  },

  checkoutInformationPage: async ({page},use) =>{
    await use(new CheckOutInformationPage(page))
  },
  checkoutOverviewPage: async ({page},use) =>{
    await use(new CheckoutOverviewPage(page))
  },

  auth: async ({loginPage}, use)=>{
    const auth = new AuthHelper(loginPage)
    await use(auth)
  }
})

export { expect }