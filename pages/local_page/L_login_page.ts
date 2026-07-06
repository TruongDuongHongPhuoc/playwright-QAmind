import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes, Routes } from "../../constant/routes";

export class LocalLoginPage extends LocalBasePage{
    readonly emailInput : Locator
    readonly passwordInput : Locator
    readonly loginButton : Locator

    // this list only purpose for demonstration. 
    readonly userList = {
        adminEmail: 'admin@test.com',
        adminPass:'123456',
        authorEmail:'author@test.com',
        authorPass:'123456',
        userEmail:'user@test.com',
        userPass:'123456',
    }

    constructor(page:Page){
        super(page)
        this.emailInput = page.locator('input#email')
        this.passwordInput = page.locator('input#password')
        this.loginButton = page.locator("button[type='submit']")
    }

    async goto(){
        await this.page.goto(LocalRoutes.loginPage)
        await this.page.waitForURL(LocalRoutes.loginPage)
    }

    async login(email:string, password:string){
        await this.goto()
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async waitForLogin(){
        await this.page.waitForURL(LocalRoutes.dashboardPage)
    }
}