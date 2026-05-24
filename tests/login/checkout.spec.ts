import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'
import { clickSortProduct } from '../../utils/helper/helper'

test.describe('User can process check out', () => {

  test.beforeEach(async ({auth}) =>{
    await auth.loginAsUser()
  })
  
  test('Verify that the user can process checkout with the correct information',async ({productPage,cartPage,checkoutInformationPage,checkoutOverviewPage,page}) =>{
    // preconditinon
    const prod1Name = 'Sample Shoe Name'
    const prod2Name = 'Sample Shirt Name'
    
    const prod1Card = await productPage.getProductCardByName(prod1Name)
    const prod2Card = await productPage.getProductCardByName(prod2Name)

    await productPage.click(prod1Card.CartButton)
    await productPage.click(prod2Card.CartButton)

    // Navigate to cart page
    await cartPage.navigate()
    await expect(cartPage.headingTextH3).toBeVisible()

    // Increase quantity of a product to 3
    const prod1Cart = await cartPage.get_Product_Card_By_Name(prod1Name)
    const prod2Cart = await cartPage.get_Product_Card_By_Name(prod2Name)

    for(let i =0 ; i < 3; i++){
      await cartPage.click(prod2Cart.increaseQuantityButton)
    }

    const prod1CartObj = await prod1Cart.toProduct()
    const prod2CartObj = await prod2Cart.toProduct()
    prod2CartObj.quantity = 4;
    
    // Click checkout
    await cartPage.click(cartPage.checkOutButton)
    await expect(page).toHaveURL('/ecommerce/checkout-info')

    // Observe email field
    const EmailValue = await checkoutInformationPage.get_attribute(checkoutInformationPage.emailInput,'value') 
    await expect(EmailValue).toEqual(process.env.EMAIL!)

    // First name, Last name, Zip code is empty
    await expect(checkoutInformationPage.firstNameInput).toBeEmpty()
    await expect(checkoutInformationPage.lastNameInput).toBeEmpty()
    await expect(checkoutInformationPage.zipCodeInput).toHaveValue('1207')
    await checkoutInformationPage.clear_input(checkoutInformationPage.zipCodeInput)

    // Input Valid first name
    await checkoutInformationPage.input(checkoutInformationPage.firstNameInput,'Janne')

    // Input valid last name
    await checkoutInformationPage.input(checkoutInformationPage.lastNameInput,"Le'arch")

    // Input valid zip code
    await checkoutInformationPage.input(checkoutInformationPage.zipCodeInput,"90000")

    // Click continue
    await checkoutInformationPage.click(checkoutInformationPage.continueButton)
    await expect(page).toHaveURL('/ecommerce/checkout-overview')

    // Obverse the product's information
    const checkoutProd1 = await checkoutOverviewPage.get_Product_Card_By_Name(prod1Name)
    const checkoutProd2 = await checkoutOverviewPage.get_Product_Card_By_Name(prod2Name)

    const checkoutProd1Obj = await checkoutProd1.toProduct()
    const checkoutProd2Obj = await checkoutProd2.toProduct()
  
    await expect(prod1CartObj).toEqual(checkoutProd1Obj)
    await expect(prod2CartObj).toEqual(checkoutProd2Obj)
    
    // Obverse the price total
    const total_price = Number(((checkoutProd1Obj.totalPrice ?? 0) + (checkoutProd2Obj.totalPrice ?? 0)).toFixed(2))
    const tax_price = Number((total_price * 0.05).toFixed(2))
    const total_price_after_tax = Number((total_price + tax_price).toFixed(2))
    
    await expect(checkoutOverviewPage.itemTotalSpan).toContainText(total_price.toString())
    await expect(checkoutOverviewPage.taxSpan).toContainText(tax_price.toString())
    await expect(checkoutOverviewPage.totalAfterTaxSpan).toContainText(total_price_after_tax.toString())
    
    // Click finish
    await checkoutOverviewPage.click(checkoutOverviewPage.finishButton)
    await expect(page).toHaveURL('/ecommerce/checkout-complete')

    // Click continue shopping
    await checkoutOverviewPage.click(checkoutOverviewPage.continueShoppingButton)
    await expect(page).toHaveURL('/ecommerce')

    // Navigate to cart
    await cartPage.navigate()
    await expect(cartPage.headingTextH3).toBeVisible()
    
    // All checked out product has removed (empty)
    await expect(cartPage.productInCartDivs).toHaveCount(0)

  })

  test('Verify that user can navigate to last steps when procees check out',async({productPage,cartPage,checkoutInformationPage,page})=> {
    //precondition
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    await productPage.clickAddToCartByName(prod1Name)
    
    // Navigate to cart page
    await cartPage.navigate()
    await expect(cartPage.headingTextH3).toBeVisible()

    // Increase quantity of a product to 3
    const prod1Cart = await cartPage.get_Product_Card_By_Name(prod1Name)
    await cartPage.increase_quantity_product_by(2,prod1Cart)

    // Click checkout
    await cartPage.click(cartPage.checkOutButton)
    await expect(page).toHaveURL('/ecommerce/checkout-info') 

    // Click cancel button
    await checkoutInformationPage.click(checkoutInformationPage.cancelButton)
    await expect(cartPage.headingTextH3).toBeVisible()


  })

  test.fail('Verify that the user information is retained when checkout',async({page,productPage,cartPage,checkoutOverviewPage,checkoutInformationPage}) =>{
    //precondition
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    const prod2Name = (await productPage.getAllProductsName()).at(2) ?? ''

    await productPage.clickAddToCartByName(prod1Name)
    await productPage.clickAddToCartByName(prod2Name)

    // Navigate to cart page
    await cartPage.navigate()
    await expect(cartPage.headingTextH3).toBeVisible()

    // Increase quantity of a product to 3
    const prod2Cart = await cartPage.get_Product_Card_By_Name(prod2Name)
    await cartPage.increase_quantity_product_by(2,prod2Cart)

    // Click checkout
    await cartPage.click(cartPage.checkOutButton)
    await expect(page).toHaveURL('/ecommerce/checkout-info') 

    // Input valid First name, Last name, Zip code
    const firstName = 'Janne'
    const lastName = "Le'arch"
    const zipCode = "90000"

    await checkoutInformationPage.input(checkoutInformationPage.firstNameInput,firstName)
    await checkoutInformationPage.input(checkoutInformationPage.lastNameInput,lastName)
    await checkoutInformationPage.input(checkoutInformationPage.zipCodeInput,zipCode)

    // Click continue
    await checkoutInformationPage.click(checkoutInformationPage.continueButton)
    await expect(page).toHaveURL('/ecommerce/checkout-overview')

    // Click cancel
    await checkoutOverviewPage.click(checkoutOverviewPage.cancelButton)
    await expect(page).toHaveURL('/ecommerce/checkout-info')

    // Observe
    await expect(checkoutInformationPage.firstNameInput).toHaveValue(firstName)
    await expect(checkoutInformationPage.firstNameInput).toHaveValue(lastName)
    await expect(checkoutInformationPage.firstNameInput).toHaveValue(zipCode)

  })

  test.fail('Verify that the user information is required',async({page ,productPage, cartPage, checkoutInformationPage})=>{
    //precondition
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    await productPage.clickAddToCartByName(prod1Name)

    //Navigate to cart page
    await cartPage.navigate()
    await expect(cartPage.headingTextH3).toBeVisible()
    
    // Click checkout
    await cartPage.click(cartPage.checkOutButton)
    await expect(page).toHaveURL('/ecommerce/checkout-info') 

    // Click continue
    await checkoutInformationPage.click(checkoutInformationPage.continueButton)
    await checkoutInformationPage.wait_for_webidle();
    await expect(page).toHaveURL('/ecommerce/checkout-info') 
  
  })

  test('Verify that the user information, first name, last name, postal code is NOT validated by the system',async({page ,productPage, cartPage, checkoutInformationPage, checkoutOverviewPage})=>{
    //precondition 
    const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
    await productPage.clickAddToCartByName(prod1Name)

    // Navigate to cart page
    await cartPage.navigate()
    await expect(cartPage.headingTextH3).toBeVisible()
    
    // Click checkout
    await cartPage.click(cartPage.checkOutButton)
    await expect(page).toHaveURL('/ecommerce/checkout-info') 
    
    // Input first name (Eg. John🤡123!@#}{:"?>)
    await checkoutInformationPage.input(checkoutInformationPage.firstNameInput,'John🤡123!@#')
    
    // Input valid last name (Eg. Doe🤡123!@#}{:"?>)
    await checkoutInformationPage.input(checkoutInformationPage.lastNameInput,'Doe🤡123!@#')
    
    // Input valid postal code (Eg. Code🤡123!@#}{:"?>)
    await checkoutInformationPage.input(checkoutInformationPage.firstNameInput,'Code🤡123!@#')
    
    // Click continue
    await checkoutInformationPage.click(checkoutInformationPage.continueButton)
    await expect(page).toHaveURL('/ecommerce/checkout-overview')

  })

})