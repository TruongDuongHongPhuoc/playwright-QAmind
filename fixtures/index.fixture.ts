import { test as baseTest, expect } from '@playwright/test'
import { LoginPage } from '../pages/login_page'
import { ProductPage } from '../pages/product_page'
import { FavoritePage } from '../pages/favorite_page'
import { AuthHelper } from '../utils/helper/loginHelper'
import { ProductDetailPage } from '../pages/product_detail_page'
import { CartPage } from '../pages/cart_page'
import { CheckOutInformationPage } from '../pages/CheckoutInformation'
import { CheckoutOverviewPage } from '../pages/CheckoutOverview'
import { LocalLoginPage } from '../pages/local_page/L_login_page'
import { LocalDashboardPage } from '../pages/local_page/L_dashboard_page'
import { LocalCreateCoursePage } from '../pages/local_page/L_createcourse_page'
import { LocalApprovalPage } from '../pages/local_page/L_approval_page'
import { LocalCourseListPage } from '../pages/local_page/L_courselist_page'
import { APISession } from '../API/apisession'
import { LocalDatePage } from '../pages/local_page/L_date_page'
import { LocalTablePage } from '../pages/local_page/L_table_page'
import { LocalHelpCenterPage } from '../pages/local_page/L_help_center_page'
import { LocalPlayGroundPage } from '../pages/local_page/L_playground_page'

type MyFixture = {
  loginPage: LoginPage
  productPage: ProductPage
  favoritePage: FavoritePage
  productDetailPage: ProductDetailPage
  cartPage:CartPage
  checkoutInformationPage:CheckOutInformationPage
  checkoutOverviewPage: CheckoutOverviewPage
  auth: AuthHelper

  localLoginPage:LocalLoginPage
  localDashboardPage: LocalDashboardPage
  localCreateCoursePage: LocalCreateCoursePage
  localApprovalPage: LocalApprovalPage
  localCourseListPage: LocalCourseListPage
  localDatePage: LocalDatePage
  localTablePage: LocalTablePage
  localHelpCenterPage: LocalHelpCenterPage
  localPlayGroundPage: LocalPlayGroundPage

  apisession: APISession
}

export const test = baseTest.extend<MyFixture>({

  apisession: async ({ request }, use) => {
    await use(new APISession(request))
  },

  localPlayGroundPage: async ({page},use) => {
    await use(new LocalPlayGroundPage(page))
  },

  localHelpCenterPage: async ({page},use) => {
    await use(new LocalHelpCenterPage(page))
  },

  localTablePage: async ({page},use) => {
    await use(new LocalTablePage(page))
  },

  localDatePage: async ({page},use) => {
    await use(new LocalDatePage(page))
  },

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

  localLoginPage: async ({ page }, use) => {
    await use(new LocalLoginPage(page))
  },

  localApprovalPage: async ({ page }, use) => {
    await use(new LocalApprovalPage(page))
  },

  localCourseListPage: async ({ page }, use) => {
    await use(new LocalCourseListPage(page))
  },

  localDashboardPage: async ({ page }, use) => {
    await use(new LocalDashboardPage(page))
  },

  localCreateCoursePage: async ({ page }, use) => {
    await use(new LocalCreateCoursePage(page))
  },

   auth: async ({loginPage,localLoginPage}, use)=>{
    const auth = new AuthHelper(loginPage,localLoginPage)
    await use(auth)
  },
})

export { expect }
