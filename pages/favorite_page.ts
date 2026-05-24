import { Locator, Page } from "@playwright/test";
import { AbtractProductPage } from "./abtract_product_page";

export class FavoritePage extends AbtractProductPage{

    userNameSpan: Locator
    favoritesMenuItem: Locator
    noFavProductText: Locator

    constructor(page:Page){
        super(page)
        this.userNameSpan = page.locator("span.user-name")
        this.favoritesMenuItem = page.locator('div[role="group"] div[role="menuitem"]')
        this.noFavProductText = page.locator('h2.text-xl')
    }

    async goto(){
        await this.page.goto("https://practice.qabrains.com/ecommerce/favorites")
    }

    async navigateTo(){
        await this.click(this.userNameSpan)
        await this.click(this.favoritesMenuItem)
    }

    

    
}