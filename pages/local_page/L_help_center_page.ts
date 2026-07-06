import { FrameLocator, Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";

export class LocalHelpCenterPage{
    iframeRoot: FrameLocator

    constructor(page: Page){
        this.iframeRoot = page.frameLocator("iframe#help-frame")
    }

    get searchInput(){
        return this.iframeRoot.locator("input#help-search")
    }

    get contactButton(){
        return this.iframeRoot.locator("button#contact-us")
    }

    get contactSuccessText(){
        return this.iframeRoot.locator('p[id^="contact"]')
    }

}
