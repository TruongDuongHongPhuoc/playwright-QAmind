import { Page, Locator } from '@playwright/test'
import { BasePage } from './base_page'
import { Product } from '../models/product'

export class ProductDetailPage extends BasePage{

    readonly productNameSpan: Locator
    readonly favoriteButton: Locator
    readonly productPriceDiv: Locator
    readonly addQuantityButton: Locator
    readonly reduceQuantityButton: Locator
    readonly cartButton: Locator

    constructor(page:Page){
        super(page)
        this.productNameSpan = page.locator('h1.text-2xl')
        this.favoriteButton = page.locator('span button[class*="cursor-pointer"]:has(svg)')
        this.productPriceDiv = page.locator('div.text-xl')
        this.addQuantityButton = page.locator("//button[text()='+']")
        this.reduceQuantityButton = page.locator("div.flex.items-center.gap-1 button").first()
        this.cartButton = page.locator('div.add-cart > button')
    }

    async clickFavoriteButton() {
        await this.click(this.favoriteButton)
    }

    async getProductName():Promise<string>{
        return await this.get_text(this.productNameSpan) ?? ''
    }

    async getProductPrice(): Promise<number> {
        const priceText = (await this.get_text(this.productPriceDiv)) ?? '0'
        return Number(priceText.replace('$', '').trim())
    }



}