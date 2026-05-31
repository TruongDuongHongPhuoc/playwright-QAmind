import { Locator } from "@playwright/test";
import { Product } from "../models/product";
import { AuthHelper } from "../utils/helper/loginHelper";
import { getNumberFromString } from "../utils/helper/helper";

export class CartProductCard {

    readonly root: Locator

    constructor(root: Locator){
        this.root = root
    }

    get name(){
        return this.root.locator('div h3.text-lg')
    }

    get price(){
        return this.root.locator("//p[text()='Price']/following-sibling::p")
    }

    get quantity(){
        return this.root.locator('span.border')
    }

    get totalPrice(){
        return this.root.locator("//p[text()='Total']/following-sibling::p")
    }
    
    get increaseQuantityButton(){
        return this.root.locator("//button[text()='+']")
    }

    get reduceQuantityButton(){
        return this.root.locator("//button[text()='-']")
    }

    get removeFromCartButton(){
        return this.root.locator('div.mt-3 button')
    }

    async increaseQuantityProductBy(index:number){
        for(let i = 0; i < index; i++){
            await this.increaseQuantityButton.click()
        }
    }

    async decreaseQuantityProductBy(index:number){
        for(let i = 0; i < index; i++){
            await this.reduceQuantityButton.click()
        }
    }

    async toProduct(): Promise<Product> {
        const totalPriceText = await this.totalPrice.textContent() ?? ''
        const totalPriceNumber = await getNumberFromString(totalPriceText)

        return {
            name:
              (await this.name.textContent())
              ?.trim() ?? '',

            price: Number(
              (await this.price.textContent())
              ?.replace('$','')
            ),
            quantity: Number(
                (await this.quantity.textContent())
            ),
            totalPrice: totalPriceNumber
        }
    }
}