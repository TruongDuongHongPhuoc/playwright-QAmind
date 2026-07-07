import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base_page'
import { Routes } from '../constant/routes'

export class LoginPage extends BasePage{

    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly showPassButton: Locator
    readonly emailErrorText: Locator
    readonly passwordErrorText: Locator

    readonly errorTexts = {
        requiredEmail: 'Email is a required field',
        requiredPassword: 'Password is a required field',
        invalidUsername: 'Username is incorrect.',
        invalidPassword: 'Password is incorrect.',
        invalidEmail:'Email must be a valid email'
    }

    constructor (page:Page){
        super(page)
        this.emailInput = page.locator("input#email")
        this.passwordInput = page.locator("input#password")
        this.loginButton = page.locator("button[type='submit']")
        this.showPassButton = page.locator("input + button:has(svg)")
        this.emailErrorText = page.locator("div:has(input#email) > p[class^='text-red-500']")
        this.passwordErrorText = page.locator("div:has(input#password) > p[class^='text-red-500']")
    }

    async goto(){
        await this.page.goto(Routes.loginPage)
    }

    //check if password is shown by check the type
    async isPasswordShow(): Promise<boolean>{
        const typeOfPass = await this.passwordInput.getAttribute('type')
        return typeOfPass === 'text'
    }

    async waitForLoggedIn(){
        await this.page.waitForURL(Routes.productPage)
    }

    async login(userName: string, password: string){
        await this.goto()
        await this.emailInput.fill(userName)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async clearLoginFields(){
        await this.emailInput.clear()
        await this.passwordInput.clear()
    }

}