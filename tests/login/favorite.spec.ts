import { ProductCard } from '../../components/product_card'
import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'
import { FavoritePage } from '../../pages/favorite_page'
import { ProductDetailPage } from '../../pages/product_detail_page'

test.describe("User can add/remove favorite product", () => {

    test.beforeEach(async ({auth}) =>{
        await auth.loginAsUser()
    })

    test('Verify that user can add favorite product', async ({ productPage, favoritePage,productDetailPage, page }) => {
        const favoriteProductList: Product[] = []

        const productCard = await productPage.getProductCardByName('Sample Shirt Name')
        await productPage.click(productCard.favoriteButton)

        await page.reload()

        let style_button: string = await productPage.get_attribute(productCard.favoriteButton,'style')  ?? ''
        
        await expect(style_button).toContain('color: rgb(255, 0, 0);')
        const FavProduct1: Product = await productCard.toProduct()
        favoriteProductList.push(FavProduct1)

        const productCard1 = await productPage.getProductCardByName("Sample T-Shirt Name")
        await productPage.click(productCard1.name)
        await expect(productDetailPage.productNameSpan).toBeVisible()
        await productDetailPage.clickFavoriteButton()
        await page.reload()
        style_button = await productDetailPage.get_attribute(productDetailPage.favoriteButton,"style") ??''
        await expect(style_button).toContain('color: rgb(255, 0, 0);')
        const FavProduct2: Product = {
            name: (await productDetailPage.getProductName()),
            price: (await productDetailPage.getProductPrice())
        }
        favoriteProductList.push(FavProduct2)

        await favoritePage.navigateTo()
        await expect(page).toHaveURL('/ecommerce/favorites')
        const favoriateProducts:Product[] = await favoritePage.getProducts()
        
        await expect(favoriateProducts).toEqual(expect.arrayContaining(favoriteProductList))
    })

    test('Verify that user can remove favorite product', async ({auth, productPage, favoritePage, productDetailPage, page}) => {
        const product1 = 'Sample Shirt Name';
        const product2 = 'Sample Shoe Name';
        const product3 = 'Sample Jacket Name';

        // Add favorites
        await productPage.click((await productPage.getProductCardByName(product1)).favoriteButton);
        await productPage.click((await productPage.getProductCardByName(product2)).favoriteButton);
        await productPage.click((await productPage.getProductCardByName(product3)).favoriteButton);

        // Go to favorites
        await favoritePage.navigateTo();
        await expect(page).toHaveURL('/ecommerce/favorites');

        // Remove product 1
        await favoritePage.click((await favoritePage.getProductCardByName(product1)).favoriteButton);

        expect(await favoritePage.getAllProductsName()).not.toContain(product1);

        // Remove product 2 from detail page
        await favoritePage.click((await favoritePage.getProductCardByName(product2)).name);

        await expect(productDetailPage.productNameSpan).toBeVisible();
        await productDetailPage.click(productDetailPage.favoriteButton);

        await favoritePage.navigateTo();
        await expect(page).toHaveURL('/ecommerce/favorites');

        expect(await favoritePage.getAllProductsName()).not.toContain(product2);

        // Remove product 3
        await favoritePage.click((await favoritePage.getProductCardByName(product3)).favoriteButton);

        expect(await favoritePage.getAllProductsName()).not.toContain(product3);

        await expect(favoritePage.noFavProductText).toBeVisible();
            
    })

})