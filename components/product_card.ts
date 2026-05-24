import { Locator } from "@playwright/test";
import { Product } from "../models/product";

export class ProductCard {

    readonly root: Locator

    constructor(root: Locator){
        this.root = root
    }

    get name(){
        return this.root.locator('a.text-lg')
    }

    get price(){
        return this.root.locator('span.text-lg')
    }

    get favoriteButton(){
        return this.root.locator('button:has(svg)')
    }

    get CartButton(){
        return this.root.locator('div button')
    }

    async toProduct(): Promise<Product> {
        return {
            name:
              (await this.name.textContent())
              ?.trim() ?? '',

            price: Number(
              (await this.price.textContent())
              ?.replace('$','')
            )
        }
    }
}