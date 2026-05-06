import { expect, Locator, Page } from "@playwright/test";
import { ProductPage } from "../../pages/product_page";


export async function clickSortProduct(page: ProductPage,selectOption:string) {
        const originList = await page.getProducts()
        await page.ClickOrderDropdown()
        await page.clickOrderOptionsByValue(selectOption)
        await expect(async () => {
            const after = await page.getProducts()
            expect(after).not.toEqual(originList)
        }).toPass()
    }