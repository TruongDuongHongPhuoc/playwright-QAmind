import {test,Page, Locator} from '@playwright/test'

export class HeaderComponent{
    readonly logoImage: Locator
    readonly cartButton: Locator
    readonly userEmailSpan: Locator
    readonly logoutButton: Locator
    readonly confirmLogOutButton: Locator
    readonly favoritesMenuItem: Locator

    constructor(page:Page){
        this.logoImage = page.locator('img[alt="logo"][class^=w]')
        this.cartButton = page.locator("div.profile span[role='button']")
        this.userEmailSpan = page.locator("span[class*=user-name]")
        this.logoutButton = page.locator('div[role="menu"] button')
        this.favoritesMenuItem = page.locator('div[role="group"] div[role="menuitem"]')
        this.confirmLogOutButton = page.locator('div[data-slot="dialog-footer"] > button').last()
    }

    async logout(){
        await this.userEmailSpan.click()
        await this.logoutButton.click()
        await this.confirmLogOutButton.click()
    }
    
    async navigateToFavoritePage(){
        await this.userEmailSpan.click()
        await this.favoritesMenuItem.click()
    }

    
}