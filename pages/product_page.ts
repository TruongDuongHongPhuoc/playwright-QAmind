import { Page, expect } from "@playwright/test";
import { AbstractProductPage } from "./abstract_product_page";

export class ProductPage extends AbstractProductPage {

    async goto(): Promise<void> {
        await this.page.goto('/ecommerce')
    }

    async clickSortProduct(selectOption:string) {
        const originList = await this.getProducts()
        await this.ClickOrderDropdown()
        await this.clickOrderOptionsByValue(selectOption)
        await expect(async () => {
            const after = await this.getProducts()
            expect(after).not.toEqual(originList)
        }).toPass()
    }
}