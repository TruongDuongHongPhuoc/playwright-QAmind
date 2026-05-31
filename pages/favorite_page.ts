import { Locator, Page } from "@playwright/test";
import { AbstractProductPage } from "./abstract_product_page";
import { Route } from "@playwright/test";

export class FavoritePage extends AbstractProductPage{

    userNameSpan: Locator
    favoritesMenuItem: Locator
    noFavProductText: Locator

    constructor(page:Page){
        super(page)
        this.userNameSpan = page.locator("span.user-name")
        this.favoritesMenuItem = page.locator('div[role="group"] div[role="menuitem"]')
        this.noFavProductText = page.locator('h2.text-xl')
    }
    
}