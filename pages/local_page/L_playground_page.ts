import { Browser, Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes, Routes } from "../../constant/routes";
import { LocalDashboardPage } from "./L_dashboard_page";

export class LocalPlayGroundPage extends LocalBasePage{
    readonly openModalButton : Locator
    readonly modalRoot: Locator
    readonly openToastButton: Locator
    readonly toastMessageDiv: Locator
    readonly playgroundDropdown: Locator
    readonly playgroundDropdownSelectedValueSpan: Locator
    readonly sampleUploadInput: Locator
    readonly sampleUploadResultSpan: Locator
    readonly downloadCSVButton: Locator
    readonly openNewTabButton: Locator

    readonly playgroundDropdownvalues = {
        alpha: "alpha",
        beta:"beta",
        gamma:"gamma"
    }
    
    constructor(page:Page){
        super(page)
        this.openModalButton = page.locator('button#open-modal')
        this.modalRoot = page.locator('div[role="dialog"]')
        this.openToastButton = page.locator('button#show-toast')
        this.toastMessageDiv = page.locator('div#toast-message')
        this.playgroundDropdown = page.locator('select#playground-dropdown')
        this.playgroundDropdownSelectedValueSpan = page.locator("span#dropdown-result")
        this.sampleUploadInput = page.locator('input#sample-upload')
        this.sampleUploadResultSpan = page.locator('span#upload-result')
        this.downloadCSVButton = page.locator('a#download-csv')
        this.openNewTabButton = page.locator('a#open-new-tab')
    }

    async getModalParagraph(){
        return await this.modalRoot.locator("p").textContent()
    }

    async closeModal(){
        return await this.modalRoot.locator('button#close-modal').click()
    }

    async ClickopenNewTab():Promise<Page>{
        const pageEventPromise = this.page.waitForEvent("popup")
        
        await this.openNewTabButton.click()
        
        const newTab = await pageEventPromise
        await newTab.waitForLoadState()
    
        return newTab
    }


    



}