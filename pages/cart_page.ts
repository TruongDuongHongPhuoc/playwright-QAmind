import { Locator, Page, expect } from "@playwright/test";
import { AbstractProductPage } from "./abstract_product_page";
import { BasePage } from "./base_page";
import { CartProductCard } from "../components/cart_product_card";
import { HeaderComponent } from "../components/header";
import { Routes } from "../constant/routes";
import { Product } from "../models/product";

export class CartPage extends BasePage{

    cartQuantityBadge: Locator
    productInCartDivs: Locator
    headingTextH3: Locator
    continueShoppingButton: Locator
    checkOutButton: Locator

    //component injection
    readonly headerComponent: HeaderComponent

    //dialog remove product 
    confirmRemoveDiaglog: Locator
    confirmRemoveButton: Locator
    closeDiaglogButton: Locator
    xIconDiaglogButton: Locator

    constructor(page:Page){
        super(page)
        this.cartQuantityBadge = page.locator('span.bg-qa-clr')
        this.productInCartDivs = page.locator('div.cart-list > div')
        this.headingTextH3 = page.locator('div#cart h3.text-xl')
        this.continueShoppingButton = page.locator('div#cart button[type="button"]:has(span.text-sm)')
        this.checkOutButton = page.locator('div#cart button:has(span)').last()

        this.headerComponent = new HeaderComponent(page)

        this.confirmRemoveDiaglog = page.locator('div[role="dialog"]')
        this.confirmRemoveButton = this.confirmRemoveDiaglog.locator('div button').last()
        this.closeDiaglogButton = this.confirmRemoveDiaglog.locator('div button').first()
        this.xIconDiaglogButton = this.confirmRemoveDiaglog.locator('div + button')
    }

    async navigateTo(){
        await this.headerComponent.cartButton.click()
        await expect(this.headingTextH3).toBeVisible()
    }

    async getProductCardByName(productName:string):Promise<CartProductCard>{
        const root = await this.page.locator('div.cart-list > div').filter({
            has: this.page.getByText(productName),
        });
        return new CartProductCard(root)
    }

    async assertTotalPriceOfCart(cartProduct:CartProductCard) {
        const cartProductObj = await cartProduct.toProduct()
        const total = cartProductObj!.price * (cartProductObj!.quantity ?? 1);
        await expect(cartProduct.totalPrice).toHaveText('$'+total)
    }

    async expectCartContainProduct(product: Product){
        const actualProdCard = await this.getProductCardByName(product.name)
        const actualProd = await actualProdCard.toProduct()
        await expect(product).toEqual(actualProd)
    }

    async navigateToCheckoutInformation(){
        await this.checkOutButton.click()
        await this.page.waitForURL(Routes.checkoutInformationPage)
    }

}