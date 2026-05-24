import { Page } from "@playwright/test";
import { AbtractProductPage } from "./abtract_product_page";

export class ProductPage extends AbtractProductPage {

    async goto(): Promise<void> {
        await this.page.goto('/ecommerce')
    }
}