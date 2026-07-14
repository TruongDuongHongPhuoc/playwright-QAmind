import { expect } from "@playwright/test";
import { ProductPage } from "../pages/product_page";
import { test } from "@playwright/test";


export async function addProductFromIndexToCart(productPage: ProductPage, index: number)
{
    return test.step("Add product to cart",async() => {
        const productName = (await productPage.getAllProductsName()).at(index) ?? ''
        const productInstance = await productPage.getProductCardByName(productName)
        await productInstance.CartButton.click()
        await expect(productInstance.CartButton).toHaveText("Remove from cart")
        return productName
    })
}



