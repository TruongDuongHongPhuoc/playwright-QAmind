import { Routes } from '../../constant/routes'
import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'

test.describe("User can add/remove favorite product", () => {

    test.beforeEach(async ({auth}) =>{
        await auth.loginAsUser()
    })

    test('Verify that user can add favorite product', async ({ productPage, favoritePage,productDetailPage, page }) => {
        // initiate data
        const expectedFavoriteProduct: Product[] = []
        const prod1Name = 'Sample Shirt Name'
        const prod2Name = 'Sample T-Shirt Name'
        
        // Click into heart icon of a product
        const productCard = await productPage.getProductCardByName(prod1Name)
        await productCard.favoriteButton.click()

        // Refresh the page
        await page.reload()
        
        //verify favorited product
        await productPage.expectFavoritedProduct(prod1Name)

        // push to list for verify
        const FavProduct1: Product = await productCard.toProduct()
        expectedFavoriteProduct.push(FavProduct1)

        // Click an other product image
        await productPage.navigateToProductDetail(prod2Name)
        await expect(productDetailPage.productNameSpan).toBeVisible()
        
        // Click heart icon
        await productDetailPage.favoriteButton.click()

        // Refresh the page
        await page.reload()

        //verify product favorited
        await productDetailPage.expectFavoritedProduct()
        
        //push to list to verify
        const FavProduct2: Product = await productDetailPage.getProductObject()
        expectedFavoriteProduct.push(FavProduct2)

         // navigate to favorites page
        await favoritePage.headerComponent.navigateToFavoritePage();
        await expect(page).toHaveURL(Routes.favoritePage)

        const favoriteProducts:Product[] = await favoritePage.getProducts()
        
        // Verify favorites product
        await expect(favoriteProducts).toEqual(expect.arrayContaining(expectedFavoriteProduct))
    })

    test('Verify that user can remove favorite product', async ({auth, productPage, favoritePage, productDetailPage, page}) => {
        //precondition
        const prod1Name = 'Sample Shirt Name';
        const prod2Name = 'Sample Shoe Name';
        const prod3Name = 'Sample Jacket Name';

        const prod1Card = await productPage.getProductCardByName(prod1Name)
        let prod2Card = await productPage.getProductCardByName(prod2Name)
        let prod3Card = await productPage.getProductCardByName(prod3Name)
        
        // Add favorites
        await prod1Card.favoriteButton.click()
        await prod2Card.favoriteButton.click()
        await prod3Card.favoriteButton.click()

        // Go to favorites
        await favoritePage.headerComponent.navigateToFavoritePage();
        await expect(page).toHaveURL(Routes.favoritePage);

        // Remove product 1
        await prod1Card.favoriteButton.click()

        // verify product 1 not present in favorite page
        expect(await favoritePage.getAllProductsName()).not.toContain(prod1Name);

        // Remove product 2 from detail page
        prod2Card = await productPage.getProductCardByName(prod2Name)
        await productPage.navigateToProductDetail(prod2Name)
        await expect(productDetailPage.productNameSpan).toBeVisible();
        await productDetailPage.favoriteButton.click()

        await favoritePage.headerComponent.navigateToFavoritePage();
        await expect(page).toHaveURL(Routes.favoritePage);

        expect(await favoritePage.getAllProductsName()).not.toContain(prod2Name);

        // Remove product 3
        prod3Card = await productPage.getProductCardByName(prod3Name)
        await prod3Card.favoriteButton.click()

        expect(await favoritePage.getAllProductsName()).not.toContain(prod3Name);

        await expect(favoritePage.noFavProductText).toBeVisible();
    })

})