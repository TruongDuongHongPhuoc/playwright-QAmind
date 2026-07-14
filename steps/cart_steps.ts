import { expect } from "@playwright/test";
import { ProductPage } from "../pages/product_page";
import { test } from "@playwright/test";
import { CartPage } from "../pages/cart_page";


export async function increaseQuantityProductBy(cartPage: CartPage,productName: string, index: number)
{
    return test.step("Increase product cart",async() => {
        const productCart = await cartPage.getProductCardByName(productName)
        await productCart.increaseQuantityProductBy(index)
        
    })
}



