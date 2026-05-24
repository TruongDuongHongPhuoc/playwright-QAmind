import { ProductCard } from '../../components/product_card'
import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'
import { ProductDetailPage } from '../../pages/product_detail_page'
import { ProductPage } from '../../pages/product_page'
import { AssertTotalPriceOfCart } from '../../utils/helper/helper'

test.describe("User can add/remove product to card",() => {
    
    test.beforeEach(async ({auth}) =>{
        await auth.loginAsUser()
    })

    test('Verify that the user can add product(s) to card',async ({productPage,productDetailPage,cartPage,page})=>{
        const prod1:ProductCard = await productPage.getProductCardByName('Sample Sunglass Name')
        const prod1Obj:Product = await prod1.toProduct()
        const prod2: ProductCard = await productPage.getProductCardByName('Sample T-Shirt Name')
        const prod2Obj: Product = await prod2.toProduct()
        const prod3: ProductCard = await productPage.getProductCardByName('Sample Shoe Name')
        const prod3Obj: Product = await prod3.toProduct()

        prod1Obj.quantity = 1

        await productPage.click(prod1.CartButton)
        await expect(prod1.CartButton).toHaveText('Remove from cart')
        await expect(cartPage.cartQuantityBadge).toHaveText('1')
        await page.reload()
        await expect(prod1.CartButton).toHaveText('Remove from cart')
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()
        await expect((await cartPage.get_Product_Card_By_Name(prod1Obj.name)).name).toBeVisible()

        const prod1Cart = await cartPage.get_Product_Card_By_Name( prod1Obj.name)
        const prod1CartObj = await prod1Cart.toProduct()
        prod1CartObj.totalPrice = undefined

        await expect(prod1CartObj).toEqual(prod1Obj)
        await cartPage.click(cartPage.continueShoppingButton)
        await expect(page).toHaveURL('/ecommerce')

        await productPage.click(prod2.name)
        await expect(productDetailPage.productNameSpan).toBeVisible()
        await productDetailPage.click(productDetailPage.cartButton)
        await productDetailPage.click(productDetailPage.cartButton)
        prod2Obj.quantity = 2

        await expect(cartPage.cartQuantityBadge).toHaveText('2')
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()
        
        const prod2Cart = await cartPage.get_Product_Card_By_Name(prod2Obj.name)
        const prod2CartObj = await prod2Cart.toProduct()
        prod2CartObj.totalPrice = undefined

        await expect(prod2Obj).toEqual(prod2CartObj) 

        await cartPage.click(cartPage.continueShoppingButton)
        await expect(page).toHaveURL('/ecommerce')

        await productPage.click(prod3.name)
        await expect(productDetailPage.productNameSpan).toBeVisible()

        for(let i=1; i<4; i++){
            await productDetailPage.click(productDetailPage.addQuantityButton)
        }

        await productDetailPage.click(productDetailPage.reduceQuantityButton)
        await productDetailPage.click(productDetailPage.cartButton)
        prod3Obj.quantity = 3

        await expect(cartPage.cartQuantityBadge).toHaveText('3')
        
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()
        
        const prod3Cart = await cartPage.get_Product_Card_By_Name(prod3Obj.name)
        const prod3CartObj = await prod3Cart.toProduct()
        prod3CartObj.totalPrice = undefined

        await expect(prod3Obj).toEqual(prod3CartObj) 
    })

    test('Verify that user can remove added product from the cart',async({productPage,cartPage, page}) =>{
        const prod1Name: string = 'Sample Shirt Name'
        const prod2Name: string = 'Sample Shoe Name'
        const prod3Name: string = 'Sample Jacket Name'
        
        // precondition
        await productPage.clickAddToCartByName(prod1Name)
        await productPage.clickAddToCartByName(prod2Name)
        await productPage.clickAddToCartByName(prod3Name)

        // Navigate to cart
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()

        // Click removes under a product
        const prod1Cart = await cartPage.get_Product_Card_By_Name(prod1Name)
        await cartPage.click(prod1Cart.removeFromCartButton)

        // Click sure in "are you sure" pop up
        await cartPage.click(cartPage.confirmRemoveButton)

        // Observe cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('2')
        await expect(prod1Cart.root).toHaveCount(0)

        // Navigate to product page
        await cartPage.click(cartPage.continueShoppingButton)
        await expect(page).toHaveURL('/ecommerce')

        // Click remove from cart button of a product
        const prod2Card = await productPage.getProductCardByName(prod2Name)
        await productPage.click(prod2Card.CartButton)
        
        // Observe cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Navigate to cart page
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()

        const prod2Cart = await cartPage.get_Product_Card_By_Name(prod2Name)
        await expect(prod2Cart.root).toHaveCount(0)
        // Reduce the quantity of a produce to 0
        const prod3Cart = await cartPage.get_Product_Card_By_Name(prod3Name)
        await cartPage.click(prod3Cart.reduceQuantityButton)

        // Click close
        await cartPage.click(cartPage.closeDiaglogButton)
        await expect(cartPage.confirmRemoveDiaglog).not.toBeVisible()
        
        // Observe the cart
        await expect(prod3Cart.root).toHaveCount(1)

        // Obsere cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Reduce the quantity of a produce to 0
        await cartPage.click(prod3Cart.reduceQuantityButton)

        // Click "x" in "are you sure" pop up
        await cartPage.click(cartPage.closeDiaglogButton)
        await expect(cartPage.confirmRemoveDiaglog).not.toBeVisible()

        // Observe the cart
        await expect(prod3Cart.root).toHaveCount(1)

        // Obsere cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')
        
        // Reduce the quantity of a produce to 0
        await cartPage.click(prod3Cart.reduceQuantityButton)

        // Click sure in "are you sure" pop up
        await cartPage.click(cartPage.confirmRemoveButton)

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
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()

        // Increase the quantity of a product to 4
        const prod1Cart = await cartPage.get_Product_Card_By_Name(prod1Name)
        for(let i=1; i<4; i++){
            await cartPage.click(prod1Cart.increaseQuantityButton)
        }

        await expect(prod1Cart.quantity).toHaveText('4')
        await AssertTotalPriceOfCart(prod1Cart)
        // Reduce the quantity of a product to 2
        for(let i=4; i>2; i--){
            await cartPage.click(prod1Cart.reduceQuantityButton)
        }

        await expect(prod1Cart.quantity).toHaveText('2')
        await AssertTotalPriceOfCart(prod1Cart)

        // Reduce the quantity of another product to below 1
        for(let i=4; i>2; i--){
            await cartPage.click(prod1Cart.reduceQuantityButton)
        }
        
        // Click cancel in "Are you sure" pop up
        await cartPage.click(cartPage.closeDiaglogButton)
        await expect(cartPage.confirmRemoveDiaglog).toBeVisible()
    

    })

    test('Verify that the cart product will remain when the user logs out, then login ',async({productPage,cartPage,page, auth})=> {
        const prod1Name = (await productPage.getAllProductsName()).at(1) ?? ''
        const prod2Name = (await productPage.getAllProductsName()).at(2) ?? ''
        
        // Add 2 products with different quantity
        const prod1Card = await productPage.getProductCardByName(prod1Name)
        const prod2Card = await productPage.getProductCardByName(prod2Name)

        await productPage.click(prod1Card.CartButton)
        await productPage.click(prod2Card.CartButton)

        // Navigate to cart page
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()
        await expect(cartPage.productInCartDivs).toHaveCount(2)

        const prod1CartObj = await cartPage.get_Product_Card_By_Name(prod1Name)
        const prod2CartObj = await cartPage.get_Product_Card_By_Name(prod2Name)

        // Log out
        await productPage.goto()
        await productPage.log_out()
        await expect(page).toHaveURL('/ecommerce/login')
        // Log in with the same credential
        await auth.loginAsUser()

        // Navigate to cart page
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()
        await expect(cartPage.productInCartDivs).toHaveCount(2)
        await expect(prod1CartObj.root).toBeVisible()
        await expect(prod2CartObj.root).toBeVisible()
    })

    test('Verify that the favorite product can be added into cart',async({favoritePage,productPage,cartPage,page})=>{
        const prod1Name = 'Sample Shirt Name'
        const prod2Name = 'Sample Shoe Name'
        
        // Mark 2 product as faviorted
        const prod1Card = await productPage.getProductCardByName(prod1Name)
        const prod2Card = await productPage.getProductCardByName(prod2Name)

        await productPage.click(prod1Card.favoriteButton)
        await productPage.click(prod2Card.favoriteButton)

        // Navigate to favorites list
        await favoritePage.navigateTo()
        await expect(page).toHaveURL('/ecommerce/favorites')

        // Click add to cart 1 product
        await favoritePage.click(prod1Card.CartButton)
        
        // Observe the cart badge
        await expect(cartPage.cartQuantityBadge).toHaveText('1')

        // Navigate to product page
        await productPage.goto()
        await expect(page).toHaveURL('/ecommerce')

        // Observe the added to cart product
        await expect(prod1Card.CartButton).toHaveText('Remove from cart')

        // Navigate to cart page
        await cartPage.navigate()
        await expect(cartPage.headingTextH3).toBeVisible()

        const prod1Cart = await cartPage.get_Product_Card_By_Name(prod1Name)
        await expect(prod1Cart.name).toHaveText(prod1Name)
    })



})