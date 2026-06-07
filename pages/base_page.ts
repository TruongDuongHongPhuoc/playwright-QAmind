import { Page, Locator } from '@playwright/test'

export abstract class BasePage {

    protected page: Page
    readonly toastMessageDiv: Locator

    constructor(page: Page) {
        this.page = page
        this.toastMessageDiv = page.locator('li[data-sonner-toast ] > div[data-content]')
    }

    async getToastMessage():Promise<string>{
        return await this.toastMessageDiv.textContent() ?? ''
    }
}
