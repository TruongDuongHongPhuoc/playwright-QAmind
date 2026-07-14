import { CartProductCard } from '../../components/cart_product_card'
import { test, expect } from '../../fixtures/index.fixture'
import { Route } from '@playwright/test'
import { Product } from '../../models/product'
import { CheckOutInformationPage } from '../../pages/CheckoutInformation'
import { Routes } from '../../constant/routes'
import { updateProductQuantity } from '../../utils/helper/helper'
import { addProductFromIndexToCart } from '../../steps/product_steps'

import { increaseQuantityProductBy } from '../../steps/cart_steps'
import { expectCheckoutOverviewMatchCartProducts, expectPricesCalculateCorrectly } from '../../steps/checkout_overview_steps'


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

  test('test',async ({productPage,cartPage,checkoutInformationPage,checkoutOverviewPage,page}) =>{
    const userCheckoutProfile = {
        firstName: "Janne",
        lastName:"Le'arch",
        zipCode: "90000"
    }  

    const productName = await addProductFromIndexToCart(productPage,0)
    const productName2 = await addProductFromIndexToCart(productPage,1)

    await cartPage.navigateTo()
    const cartProducts: Product[] = []

    await increaseQuantityProductBy(cartPage,productName2,2)
    
    
    cartProducts.push(await (await cartPage.getProductCardByName(productName)).toProduct())
    cartProducts.push(await (await cartPage.getProductCardByName(productName2)).toProduct())

    ;(cartProducts[1]).quantity = 3
    cartProducts[1].totalPrice = cartProducts[1].price * cartProducts[1].quantity

    await cartPage.checkOutButton.click()

    await checkoutInformationPage.fillCheckoutInformation(userCheckoutProfile.firstName,userCheckoutProfile.lastName,userCheckoutProfile.zipCode)

    await checkoutInformationPage.navigateToCheckoutOverview()

    await expectCheckoutOverviewMatchCartProducts(checkoutOverviewPage, cartProducts)

    await expectPricesCalculateCorrectly(checkoutOverviewPage,cartProducts)
  })

})