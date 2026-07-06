import { Page, Locator } from '@playwright/test'
import { LocalHeaderComponent } from '../../components/local_components/local_header'
import { HeaderComponent } from '../../components/header'

export abstract class LocalBasePage {

    protected page: Page
    readonly headerComponent: LocalHeaderComponent

    constructor(page: Page) {
        this.page = page
        this.headerComponent = new LocalHeaderComponent(page)
    }

    get flash() {
        return this.page.locator('div[class^="flash"]')
    }

}
