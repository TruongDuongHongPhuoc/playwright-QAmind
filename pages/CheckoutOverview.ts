import { Locator, Page } from "@playwright/test";
import { AbtractProductPage } from "./abtract_product_page";
import { BasePage } from "./base_page";
import { CartProductCard } from "../components/cart_product_card";

export class CheckoutOverviewPage extends BasePage{

    readonly cancelButton: Locator
    readonly finishButton: Locator
    readonly itemTotalSpan: Locator
    readonly taxSpan: Locator
    readonly totalAfterTaxSpan: Locator
    readonly continueShoppingButton: Locator

    constructor(page:Page){
        super(page)
        this.itemTotalSpan = page.locator("//p[contains(text(),'Item Total')]")
        this.taxSpan = page.locator("//p[contains(text(),'Tax')]")
        this.totalAfterTaxSpan = page.locator("//div[contains(@class,'group')]//p[starts-with(normalize-space(), 'Total :')]")

        this.cancelButton = page.locator('div#checkout-overview button.text-black')
        this.finishButton = page.locator('div#checkout-overview button.text-white')
        this.continueShoppingButton = page.locator('div#checkout-complete button')
    }

    async get_Product_Card_By_Name(productName:string):Promise<CartProductCard>{
        const root = await this.page.locator('div.cart-list > div').filter({
            has: this.page.getByText(productName),
        });
        return new CartProductCard(root)
    }


}