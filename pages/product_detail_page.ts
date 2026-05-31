import { Page, Locator,expect } from '@playwright/test'
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

    async getProductName():Promise<string>{
        return await this.productNameSpan.textContent() ?? ''
    }

    async getProductObject(): Promise<Product> {
        return {
            name: await this.getProductName(),
            price: await this.getProductPrice()
        }
    }

    async getProductPrice(): Promise<number> {
        const priceText = await this.productPriceDiv.textContent() ?? '0'
        return Number(priceText.replace('$', '').trim())
    }

    async increaseQuantityBy(number:number){
        for(let i=0; i<number; i++){
            await this.addQuantityButton.click()
        }
    }  

    async decreaseQuantityBy(number:number){
        for(let i=0; i<number; i++){
            await this.reduceQuantityButton.click()
        }
    }

    async expectFavoritedProduct(){
        const styleText = await this.favoriteButton.getAttribute('Style')
        await expect(styleText).toContain('color: rgb(255, 0, 0);')
    }
}