import { CartProductCard } from '../../components/cart_product_card'
import { test, expect } from '../../fixtures/index.fixture'
import { Route } from '@playwright/test'
import { Product } from '../../models/product'
import { CheckOutInformationPage } from '../../pages/CheckoutInformation'
import { Routes } from '../../constant/routes'


test.describe('User can process check out', () => {

  test.beforeEach(async ({auth}) =>{
    await auth.loginAsUser()
  })
  
  test('Verify that the user can process checkout with the correct information',async ({productPage,cartPage,checkoutInformationPage,checkoutOverviewPage,page}) =>{
    // preconditinon
    const prod1Name = 'Sample Shoe Name'
    const prod2Name = 'Sample Shirt Name'
    const userCheckoutProfile = {
        firstName: "Janne",
        lastName:"Le'arch",
        zipCode: "90000"
    }
    
    const prod1Card = await productPage.getProductCardByName(prod1Name)
    const prod2Card = await productPage.getProductCardByName(prod2Name)

    await prod1Card.CartButton.click()
    await prod2Card.CartButton.click()

    // Navigate to cart page
    await cartPage.navigateTo()

    // Increase quantity of a product to 3
    const prod1Cart: CartProductCard = await cartPage.getProductCardByName(prod1Name)
    const prod2Cart: CartProductCard = await cartPage.getProductCardByName(prod2Name)

    await prod2Cart.increaseQuantityProductBy(3)

    const prod1CartObj = await prod1Cart.toProduct()
    const prod2CartObj = await prod2Cart.toProduct()
    prod2CartObj.quantity = 4;
    
    // Click checkout
    await cartPage.navigateToCheckoutInformation()

    // Observe email field
    await checkoutInformationPage.expectDefaultValues(process.env.EMAIL!)

    // fill check out information
    await checkoutInformationPage.fillCheckoutInformation(userCheckoutProfile.firstName,userCheckoutProfile.lastName,userCheckoutProfile.zipCode)

    // Click continue
    await checkoutInformationPage.navigateToCheckoutOverview()

    // Obverse the product's information
    const checkoutProd1 = await checkoutOverviewPage.getProductCardByName(prod1Name)
    const checkoutProd2 = await checkoutOverviewPage.getProductCardByName(prod2Name)

    const checkoutProd1Obj = await checkoutProd1.toProduct()
    const checkoutProd2Obj = await checkoutProd2.toProduct()
  
    await expect(prod1CartObj).toEqual(checkoutProd1Obj)
    await expect(prod2CartObj).toEqual(checkoutProd2Obj)
    
    // Obverse the price total
    const totalPrice = Number(((checkoutProd1Obj.totalPrice ?? 0) + (checkoutProd2Obj.totalPrice ?? 0)).toFixed(2))
    const taxPrice = Number((totalPrice * 0.05).toFixed(2))
    const totalPriceWithTax = Number((totalPrice + taxPrice).toFixed(2))
    
    await expect(checkoutOverviewPage.itemTotalSpan).toContainText(totalPrice.toString())
    await expect(checkoutOverviewPage.taxSpan).toContainText(taxPrice.toString())
    await expect(checkoutOverviewPage.totalAfterTaxSpan).toContainText(totalPriceWithTax.toString())
    
    // Click finish
    await checkoutOverviewPage.finishOrder()
    await expect(page).toHaveURL(Routes.checkoutComplete)
    
    // Click continue shopping
    await checkoutOverviewPage.continueShoppingButton.click()
    await expect(page).toHaveURL(Routes.productPage)

    // Navigate to cart
    await cartPage.navigateTo()
    
    // All checked out product has removed (empty)
    await expect(cartPage.productInCartDivs).toHaveCount(0)

  })

  test('Verify that user can navigate to last steps when procees check out',async({productPage,cartPage,checkoutInformationPage,page})=> {
    //precondition
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    await productPage.clickAddToCartByName(prod1Name)
    
    // Navigate to cart page
    await cartPage.navigateTo()
    await expect(cartPage.headingTextH3).toBeVisible()

    // Increase quantity of a product to 3
    const prod1Cart = await cartPage.getProductCardByName(prod1Name)
    await prod1Cart.increaseQuantityProductBy(2)

    // Click checkout
    await cartPage.navigateToCheckoutInformation()
    await expect(page).toHaveURL(Routes.checkoutInformationPage) 

    // Click cancel button
    await checkoutInformationPage.cancelButton.click()
    await expect(cartPage.headingTextH3).toBeVisible()

  })

  test.fail('Verify that the user information is retained when checkout',async({page,productPage,cartPage,checkoutOverviewPage,checkoutInformationPage}) =>{
    const userCheckoutProfile = {
        firstName: "Janne",
        lastName:"Le'arch",
        zipCode: "90000"
    }
    
    //precondition
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    const prod2Name = (await productPage.getAllProductsName()).at(2) ?? ''

    await productPage.clickAddToCartByName(prod1Name)
    await productPage.clickAddToCartByName(prod2Name)

    // Navigate to cart page
    await cartPage.navigateTo()
    await expect(cartPage.headingTextH3).toBeVisible()

    // Increase quantity of a product to 3
    const prod2Cart = await cartPage.getProductCardByName(prod2Name)
    await prod2Cart.increaseQuantityProductBy(2)

    // Click checkout
    await cartPage.navigateToCheckoutInformation()
    await expect(page).toHaveURL(Routes.checkoutInformationPage) 
    
    // Input valid First name, Last name, Zip code

    await checkoutInformationPage.firstNameInput.fill(userCheckoutProfile.firstName)
    await checkoutInformationPage.lastNameInput.fill(userCheckoutProfile.lastName)
    await checkoutInformationPage.zipCodeInput.fill(userCheckoutProfile.zipCode)

    // Click continue
    await checkoutInformationPage.navigateToCheckoutOverview()
    await expect(page).toHaveURL(Routes.checkoutOverViewPage)

    // Click cancel
    await checkoutOverviewPage.cancelButton.click()
    await expect(page).toHaveURL(Routes.checkoutInformationPage)

    // Observe
    await expect(checkoutInformationPage.firstNameInput).toHaveValue(userCheckoutProfile.firstName)
    await expect(checkoutInformationPage.lastNameInput).toHaveValue(userCheckoutProfile.lastName)
    await expect(checkoutInformationPage.zipCodeInput).toHaveValue(userCheckoutProfile.zipCode)

  })

  test.fail('Verify that the user information is required',async({page ,productPage, cartPage, checkoutInformationPage})=>{
    //precondition
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    await productPage.clickAddToCartByName(prod1Name)

    //Navigate to cart page
    await cartPage.navigateTo()
    await expect(cartPage.headingTextH3).toBeVisible()
    
    // Click checkout
    await cartPage.navigateToCheckoutInformation()
    await expect(page).toHaveURL(Routes.checkoutInformationPage) 

    // Click continue
    await checkoutInformationPage.navigateToCheckoutOverview()
    await expect(page).toHaveURL(Routes.checkoutInformationPage) 
  
  })

  test('Verify that the user information, first name, last name, postal code is NOT validated by the system',async({page ,productPage, cartPage, checkoutInformationPage, checkoutOverviewPage})=>{
    //precondition 
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    await productPage.clickAddToCartByName(prod1Name)

    // Navigate to cart page
    await cartPage.navigateTo()
    await expect(cartPage.headingTextH3).toBeVisible()
    
    // Click checkout    
    await cartPage.navigateToCheckoutInformation()
    
    // Input first name (Eg. John🤡123!@#}{:"?>)
    await checkoutInformationPage.firstNameInput.fill('John🤡123!@#')
    
    // Input valid last name (Eg. Doe🤡123!@#}{:"?>)
    await checkoutInformationPage.lastNameInput.fill('Doe🤡123!@#')
    
    // Input valid postal code (Eg. Code🤡123!@#}{:"?>)
    await checkoutInformationPage.zipCodeInput.fill('Code🤡123!@#')
    
    // Click continue
    await checkoutInformationPage.navigateToCheckoutOverview()
    await expect(page).toHaveURL(Routes.checkoutOverViewPage)

  })

})