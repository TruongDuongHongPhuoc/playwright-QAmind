import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes } from "../../constant/routes";

export class LocalDashboardPage extends LocalBasePage{
    readonly successFlashNotification: Locator
    readonly currentUserSpan: Locator
    readonly currentRoleSpan: Locator

    readonly coursesButton: Locator 
    readonly datePickerButton: Locator 
    readonly tableDemoButton: Locator
    readonly iframeDemoButton: Locator
    readonly qaPlaygroundButton: Locator
    readonly createCourseButton: Locator
    readonly approvalsButton: Locator

    constructor(page:Page){
        super(page)
        this.successFlashNotification = page.locator('div[class="flash success"]')
        this.currentUserSpan = page.locator("//p[strong='Current user:']")
        this.currentRoleSpan = page.locator("//p[strong='Current role:']")

        this.coursesButton = page.locator('a[href="/courses"][class="button"]')
        this.datePickerButton = page.locator('a[href="/date-picker"][class="button"]')
        this.tableDemoButton = page.locator('a[href="/table-demo"][class="button"]')
        this.iframeDemoButton = page.locator('a[href="/iframe-demo"][class="button"]')
        this.qaPlaygroundButton = page.locator('a[href="/qa-playground"][class="button"]')
        this.createCourseButton = page.locator('a[href="/courses/create"][class="button"]')
        this.approvalsButton = page.locator('a[href="/approvals"][class="button"]')

    }
    async navigateToCoursePage(){
        await this.coursesButton.click()
        await this.page.waitForURL(LocalRoutes.listCoursePage)
    }

    async navigateToCreateCoursePage(){
        await this.createCourseButton.click()
        await this.page.waitForURL(LocalRoutes.createCoursePage)
    }

    async navigateToCourseApprovalPage(){
        await this.approvalsButton.click()
        await this.page.waitForURL(LocalRoutes.approvalPage)
    }

    async navigateToDatePage(){
        await this.datePickerButton.click()
        await this.page.waitForURL(LocalRoutes.datePage)
    }

    async navigateToTablePage(){
        await this.tableDemoButton.click()
        await this.page.waitForURL(LocalRoutes.tablePage)
    }

    async navigateToHelpCenterPage(){
        await this.iframeDemoButton.click()
        await this.page.waitForURL(LocalRoutes.helpCenterPage)
    }

    async navigateToPlayGroundPage(){
        await this.qaPlaygroundButton.click()
        await this.page.waitForURL(LocalRoutes.playGroundPage)
    }
    
}