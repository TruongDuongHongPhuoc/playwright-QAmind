import { ProductCard } from '../../components/product_card'
import { Routes } from '../../constant/routes'
import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'
import { updateProductQuantity } from '../../utils/helper/helper'

test.describe("User can add/remove product to cart",() => {
    
    test.beforeEach(async ({auth}) =>{
        await auth.loginAsUser()
    })

    test('Verify that the user can add product from product page', async ({productPage, cartPage, page}) => {
        const prodName = (await productPage.getAllProductsName()).at(1) ?? ''
        const prodCard = await productPage.getProductCardByName(prodName)
        const prodObj = await prodCard.toProduct()

        await prodCard.CartButton.click()
        updateProductQuantity(prodObj,1)

        // Observe cart badge
        await expect(prodCard.CartButton).toHaveText('Remove from cart')
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Refresh page
        await page.reload()

        await expect(prodCard.CartButton).toHaveText('Remove from cart')
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Navigate to cart
        await cartPage.navigateTo()

        const cartProduct = await cartPage.getProductCardByName(prodObj.name)
        await expect(cartProduct.name).toBeVisible()

        const cartProductObj = await cartProduct.toProduct()

        await expect(cartProductObj).toEqual(prodObj)
        await cartPage.expectCartContainProduct(prodObj)
    })

    test('Verify that the user can add product from product detail page', async ({productPage,productDetailPage,cartPage}) => {
    
        const productCard = await productPage.getProductCardByName('Sample T-Shirt Name')

        const product = await productCard.toProduct()

        await productPage.navigateToProductDetail(product.name)

        await expect(productDetailPage.productNameSpan).toBeVisible()

        // Add twice
        await productDetailPage.cartButton.click()
        await productDetailPage.cartButton.click()

        product.quantity = 2

        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        await cartPage.navigateTo()

        const cartProduct = await cartPage.getProductCardByName(product.name)

        const cartProductObj = await cartProduct.toProduct()

        cartProductObj.totalPrice = cartProductObj.price * (cartProductObj.quantity ?? 1)

        product.totalPrice = product.price * (product.quantity ?? 1)

        await expect(cartProductObj).toEqual(product)
    })

    test('Verify that the user can add product with custom quantity', async ({productPage,productDetailPage,cartPage}) => {
        const productCard = await productPage.getProductCardByName(
            'Sample Shoe Name'
        )
        const product = await productCard.toProduct()

        await productPage.navigateToProductDetail(product.name)

        await expect(productDetailPage.productNameSpan).toBeVisible()

        // Increase to 4
        await productDetailPage.increaseQuantityBy(3)

        // Reduce to 3
        await productDetailPage.decreaseQuantityBy(1)

        updateProductQuantity(product,3)

        await productDetailPage.cartButton.click()

        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        await cartPage.navigateTo()

        const cartProduct = await cartPage.getProductCardByName(product.name)

        const cartProductObj = await cartProduct.toProduct()

        await expect(cartProductObj).toEqual(product)})
    
    test('Verify that user can remove added product from the cart',async({productPage,cartPage, page}) =>{
        const prod1Name: string = 'Sample Shirt Name'
        const prod2Name: string = 'Sample Shoe Name'
        const prod3Name: string = 'Sample Jacket Name'
        
        // precondition
        await productPage.clickAddToCartByName(prod1Name)
        await productPage.clickAddToCartByName(prod2Name)
        await productPage.clickAddToCartByName(prod3Name)

        // Navigate to cart
        await cartPage.navigateTo()

        // Click removes under a product
        const prod1Cart = await cartPage.getProductCardByName(prod1Name)
        await prod1Cart.removeFromCartButton.click()

        // Click sure in "are you sure" pop up
        await cartPage.confirmRemoveButton.click()

        // Observe cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('2')
        await expect(prod1Cart.root).toHaveCount(0)

        // Navigate to product page
        await cartPage.continueShoppingButton.click()
        await expect(page).toHaveURL(Routes.productPage)

        // Click remove from cart button of a product
        const prod2Card = await productPage.getProductCardByName(prod2Name)
        await prod2Card.CartButton.click()
        
        // Observe cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Navigate to cart page
        await cartPage.navigateTo()
        

        const prod2Cart = await cartPage.getProductCardByName(prod2Name)
        await expect(prod2Cart.root).toHaveCount(0)
        
        // Reduce the quantity of a produce to 0
        const prod3Cart = await cartPage.getProductCardByName(prod3Name)
        await prod3Cart.reduceQuantityButton.click()

        // Click close
        await cartPage.closeDiaglogButton.click()
        await expect(cartPage.confirmRemoveDiaglog).not.toBeVisible()
        
        // Observe the cart
        await expect(prod3Cart.root).toHaveCount(1)

        // Obsere cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Reduce the quantity of a produce to 0
        await prod3Cart.reduceQuantityButton.click()

        // Click "x" in "are you sure" pop up
        await cartPage.closeDiaglogButton.click()
        await expect(cartPage.confirmRemoveDiaglog).not.toBeVisible()

        // Observe the cart
        await expect(prod3Cart.root).toHaveCount(1)

        // Obsere cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')
        
        // Reduce the quantity of a produce to 0
        await prod3Cart.reduceQuantityButton.click()

        // Click sure in "are you sure" pop up
        await cartPage.confirmRemoveButton.click()

        // Observe the cart
        await expect(prod3Cart.root).toHaveCount(0)

        // Obsere cart badge
        await expect(cartPage.cartQuantityBadge).not.toBeVisible()
    })

    test('Verify that the user can update the quantity of the product in the cart', async ({cartPage,productPage, page})=>{
        // precondition
        const prod1Name: string = 'Sample Shirt Name'
        
        // precondition
        await productPage.clickAddToCartByName(prod1Name)
        // Navigate to cart
        await cartPage.navigateTo()
        

        // Increase the quantity of a product to 4
        const prod1Cart = await cartPage.getProductCardByName(prod1Name)
        await prod1Cart.increaseQuantityProductBy(3)

        await expect(prod1Cart.quantity).toHaveText('4')
        await cartPage.assertTotalPriceOfCart(prod1Cart)
        
        // Reduce the quantity of a product to 2
        await prod1Cart.decreaseQuantityProductBy(2)

        await expect(prod1Cart.quantity).toHaveText('2')
        await cartPage.assertTotalPriceOfCart(prod1Cart)

        // Reduce the quantity of another product to below 1
        await prod1Cart.decreaseQuantityProductBy(2)
        
        // Click cancel in "Are you sure" pop up
        await cartPage.closeDiaglogButton.click()
        await expect(cartPage.confirmRemoveDiaglog).toBeVisible()

    })

    test('Verify that the cart product will remain when the user logs out, then login ',async({productPage,cartPage,page, auth})=> {
        const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
        const prod2Name = (await productPage.getAllProductsName()).at(2) ?? ''
        
        // Add 2 products with different quantity
        const prod1Card = await productPage.getProductCardByName(prod1Name)
        const prod2Card = await productPage.getProductCardByName(prod2Name)

        await prod1Card.CartButton.click()
        await prod2Card.CartButton.click()

        // Navigate to cart page
        await cartPage.navigateTo()
        
        await expect(cartPage.productInCartDivs).toHaveCount(2)

        const prod1CartObj = await (await cartPage.getProductCardByName(prod1Name)).toProduct()
        const prod2CartObj = await (await cartPage.getProductCardByName(prod2Name)).toProduct()

        // Log out
        await cartPage.headerComponent.logout()
        await expect(page).toHaveURL(Routes.loginPage)
        // Log in with the same credential
        await auth.loginAsUser()

        // Navigate to cart page
        await cartPage.navigateTo()
        
        await expect(cartPage.productInCartDivs).toHaveCount(2)
        // await expect(prod1CartObj.root).toBeVisible()
        // await expect(prod2CartObj.root).toBeVisible()

        await cartPage.expectCartContainProduct(prod1CartObj)
        await cartPage.expectCartContainProduct(prod2CartObj)
    })

    test('Verify that the favorite product can be added into cart',async({favoritePage,productPage,cartPage,page})=>{
        const prod1Name = 'Sample Shirt Name'
        const prod2Name = 'Sample Shoe Name'
        
        // Mark 2 product as faviorted
        const prod1Card = await productPage.getProductCardByName(prod1Name)
        const prod2Card = await productPage.getProductCardByName(prod2Name)

        await prod1Card.favoriteButton.click()
        await prod2Card.favoriteButton.click()

        // Navigate to favorites list
        await favoritePage.headerComponent.navigateToFavoritePage()
        await expect(page).toHaveURL(Routes.favoritePage)

        // Click add to cart 1 product
        await prod1Card.CartButton.click()
        
        // Observe the cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Navigate to product page
        await productPage.goto()
        await expect(page).toHaveURL(Routes.productPage)

        // Observe the added to cart product
        await expect(prod1Card.CartButton).toHaveText('Remove from cart')

        // Navigate to cart page
        await cartPage.navigateTo()
        
        const prod1Cart = await cartPage.getProductCardByName(prod1Name)
        await expect(prod1Cart.name).toHaveText(prod1Name)
    })

})