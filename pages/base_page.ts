import { Page, Locator } from '@playwright/test'

export abstract class BasePage {

    protected page: Page

    constructor(page: Page) {
        this.page = page
    }

    async click(locator: Locator) {
        try {
            await locator.click()
        } catch (error) {
            console.log("locator click failed: " + locator.toString())
            throw error
        }
    }
    async input(locator: Locator, value: string){
        try{
            await locator.fill(value)
        }catch(error){
            console.log("locator fill failed:" + locator.toString())
            throw error
        }
    }
    async clear_input(locator:Locator){
        try{
            await locator.clear()
        }catch(error){
            console.log("locator clear failed:" + locator.toString())
            throw error
        }
    }
    async get_attribute(locator: Locator, attributeName: string): Promise<string|null>{
        return await locator.getAttribute(attributeName)
    }
    async get_text(locator: Locator): Promise<string|null>{
        const text = await locator.textContent()
        return text
    }

    async wait_for_webidle(){
        await this.page.waitForLoadState('networkidle')
    }
}
