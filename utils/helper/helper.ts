import { expect, Locator, Page } from "@playwright/test";
import { ProductPage } from "../../pages/product_page";
import { CartProductCard } from "../../components/cart_product_card";
import { toASCII } from "node:punycode";


export async function clickSortProduct(page: ProductPage,selectOption:string) {
        const originList = await page.getProducts()
        await page.ClickOrderDropdown()
        await page.clickOrderOptionsByValue(selectOption)
        await expect(async () => {
            const after = await page.getProducts()
            expect(after).not.toEqual(originList)
        }).toPass()
    }

export async function AssertTotalPriceOfCart(cartProduct:CartProductCard) {
        const cartProductObj = await cartProduct.toProduct()
        const total = cartProductObj!.price * (cartProductObj!.quantity ?? 1);
        await expect(cartProduct.totalPrice).toHaveText('$'+total)
}

export async function GetNumberFromString(text: string):Promise<number>{
        return Number(text.replace(/[^0-9.]/g,'')) ?? 0
}