import { Locator, Page } from "@playwright/test";
import { AbtractProductPage } from "./abtract_product_page";
import { BasePage } from "./base_page";
import { CartProductCard } from "../components/cart_product_card";

export class CartPage extends BasePage{

    cartQuantityBadge: Locator
    cartButton: Locator
    productInCartDivs: Locator
    headingTextH3: Locator
    continueShoppingButton: Locator
    checkOutButton: Locator

    //dialog remove product 
    confirmRemoveDiaglog: Locator
    confirmRemoveButton: Locator
    closeDiaglogButton: Locator
    xIconDiaglogButton: Locator

    constructor(page:Page){
        super(page)
        this.cartQuantityBadge = page.locator('span.bg-qa-clr')
        this.cartButton = page.locator('div.profile span[role="button"]')
        this.productInCartDivs = page.locator('div.cart-list > div')
        this.headingTextH3 = page.locator('div#cart h3.text-xl')
        this.continueShoppingButton = page.locator('div#cart button[type="button"]:has(span.text-sm)')
        this.checkOutButton = page.locator('div#cart button:has(span)').last()

        this.confirmRemoveDiaglog = page.locator('div[role="dialog"]')
        this.confirmRemoveButton = this.confirmRemoveDiaglog.locator('div button').last()
        this.closeDiaglogButton = this.confirmRemoveDiaglog.locator('div button').first()
        this.xIconDiaglogButton = this.confirmRemoveDiaglog.locator('div + button')
    }

    async navigate(){
        await this.click(this.cartButton)
    }

    async get_Product_Card_By_Name(productName:string):Promise<CartProductCard>{
        const root = await this.page.locator('div.cart-list > div').filter({
            has: this.page.getByText(productName),
        });
        return new CartProductCard(root)
    }

    async increase_quantity_product_by(index:number, cartProductCard: CartProductCard){
        for(let i = 0; i < index; i++){
            await this.click(cartProductCard.increaseQuantityButton)
        }
    }

    async decrease_quantity_product_by(index:number, cartProductCard: CartProductCard){
        for(let i = 0; i < index; i++){
            await this.click(cartProductCard.reduceQuantityButton)
        }
    }


}