import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes, Routes } from "../../constant/routes";

export class LocalDatePage extends LocalBasePage{
    startDateInput: Locator
    endDateInput: Locator
    submitButton: Locator
    startDateSpan: Locator
    endDateSpan: Locator

    constructor(page:Page){
        super(page)
        this.startDateInput = this.page.locator("input#start_date")
        this.endDateInput = this.page.locator("input#end_date")
        this.submitButton = this.page.locator('button[type="submit"]')
        this.startDateSpan = this.page.locator("span#display-start-date")
        this.endDateSpan = this.page.locator("span#display-end-date")
    }

    async submitDateRange(startDate:string, endDate:string){
        await this.startDateInput.fill(startDate)
        await this.endDateInput.fill(endDate)
        await this.submitButton.click()
    }

    
}