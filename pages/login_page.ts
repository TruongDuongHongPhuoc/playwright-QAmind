import { Page, Locator } from '@playwright/test'
import { BasePage } from './base_page'
export class LoginPage extends BasePage{

    protected emailInput: Locator
    protected passwordInput: Locator
    protected loginButton: Locator
    protected showPassButton: Locator
    protected emailErrorText: Locator
    protected passwordErrorText: Locator

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
        await this.page.goto(process.env.BASE_URL!)
    }

    //fill email
    async fill_email(email: string){
        await this.input(this.emailInput,email)
    }
    
    // clear email field
    async clear_email(){
        await this.clear_input(this.emailInput)
    }

    // Get email error message
    async get_error_email_message(): Promise<string|null>{
        return await this.get_text(this.emailErrorText)
    }

    // get password error message
    async get_error_password_message(): Promise<string|null>{
        return await this.get_text(this.passwordErrorText)
    }
    
    // fill password
    async fill_password(password: string){
        await this.passwordInput.fill(password)
    }

    // clear password
    async clear_password(){
        await this.clear_input(this.passwordInput)
    }

    //click show password (eye icon)
    async show_pass(){
        await this.click(this.showPassButton)
    }

    //check if password is shown by check the type
    async is_password_show(): Promise<boolean>{
        const typeOfPass = await this.get_attribute(this.emailInput,'type')
        if(typeOfPass === 'text'){
            return true
        }else{
            return false
        }
    }

    // click login button
    async click_login(){
        await this.loginButton.click()
    }

    async waitForLoggedIn(){
        await this.page.waitForURL('/ecommerce')
    }

}