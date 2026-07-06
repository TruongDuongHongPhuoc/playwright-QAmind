import { Locator, Page } from "@playwright/test";

export class LocalHeaderComponent{

    readonly brandLink: Locator
    readonly dasdboardLink: Locator
    readonly coursesLink: Locator 
    readonly datePickerLink: Locator 
    readonly tableDemoLink: Locator
    readonly iframeDemoLink: Locator
    readonly qaPlaygroundLink: Locator
    readonly createCourseLink: Locator
    readonly approvalsLink: Locator
    readonly logoutLink: Locator

    constructor(page:Page){

        this.brandLink = page.locator("a[class ='brand']")
        this.dasdboardLink = page.locator('nav > a[href="/dashboard"]')

        this.coursesLink = page.locator('nav > a[href="/courses"]')
        this.datePickerLink = page.locator('nav > a[href="/date-picker"]')
        this.tableDemoLink = page.locator('nav > a[href="/table-demo"]')
        this.iframeDemoLink = page.locator('nav > a[href="/iframe-demo"]')
        this.qaPlaygroundLink = page.locator('nav > a[href="/qa-playground"]')
        this.createCourseLink = page.locator('nav > a[href="/courses/create"]')
        this.approvalsLink = page.locator('nav > a[href="/approvals"]')
        this.logoutLink = page.locator('nav > a[href="/logout"]')

    }

    async logout(){
        await this.logoutLink.click()
    }

}