import { Routes } from '../../constant/routes'
import { test, expect } from '../../fixtures/index.fixture'
import loginTestData from '../../test_data/loginData.json'
import cartTestData from '../../test_data/cartData.json'
import { waitForDebugger } from 'node:inspector';
import { getNumberFromString } from '../../utils/helper/helper';

loginTestData.forEach((row) => {

// "Test_title": "Verify that user can login with valid credential",
//     "Username": "test@qabrains.com",
//     "Password": "Password123",
//     "Expected_Status": "Success",
//     "Expected_Email_Validate": "",
//     "Expected_Password_Validate": "",
//     "Expected_Toast_Message": "credentials matched: Successfully logged in."
    test(`Login - ${row.Test_title}`, async ({ loginPage,page }) => {
        await loginPage.login(row.Username,row.Password)
        
        if (row.Expected_Status === 'Success') {
            await expect(page).toHaveURL(Routes.productPage);
        } else {

            if (row.Expected_Email_Validate) {
                await expect(loginPage.emailErrorText).toHaveText(row.Expected_Email_Validate);
                }

            if (row.Expected_Password_Validate) {
                await expect(loginPage.passwordErrorText).toHaveText(row.Expected_Password_Validate);
            }

            if (row.Expected_Toast_Message) {
                await expect(loginPage.toastMessageDiv).toContainText(row.Expected_Toast_Message);
            }

            }
  })
});

cartTestData.forEach((row) => {
    test(`Cart - ${row.testTitle}`,async ({auth,productPage,cartPage,checkoutInformationPage,checkoutOverviewPage,page}) =>{
        // precondition
        await auth.loginAsUser()

        //Add product
        for (const product of row.products){
            await productPage.clickAddToCartByName(product.name)
        }

        //navigate to cart
        await cartPage.navigateTo()

        //increase quantity
        for (const product of row.products){
            const productDiv = await cartPage.getProductCardByName(product.name)
            await productDiv.increaseQuantityProductBy(product.quantity - 1)
        }

        //process checkout
        await cartPage.navigateToCheckoutInformation()

        //Fill blanks
        await checkoutInformationPage.fillCheckoutInformation(row.customer.firstName,row.customer.lastName,row.customer.zipCode)

        //continnue check out
        await checkoutInformationPage.navigateToCheckoutOverview()
        
        //verify prices
        await expect(checkoutOverviewPage.itemTotalSpan).toContainText(row.expected.itemTotal.toString())
        await expect(checkoutOverviewPage.taxSpan).toContainText(row.expected.tax.toString())
        await expect(checkoutOverviewPage.totalAfterTaxSpan).toContainText(row.expected.finalTotal.toString())

    })
})