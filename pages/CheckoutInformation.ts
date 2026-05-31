import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base_page'
export class CheckOutInformationPage extends BasePage{

    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly emailInput: Locator
    readonly zipCodeInput: Locator
    readonly cancelButton: Locator
    readonly continueButton: Locator

    constructor(page:Page){
        super(page)
        this.firstNameInput = page.locator("input[placeholder='Ex. John']")
        this.lastNameInput = page.locator("input[placeholder='Ex. Doe']")
        this.emailInput = page.locator("input[disabled]")
        this.zipCodeInput = page.locator("//label[contains(text(),'Zip')]/following-sibling::input")
        this.cancelButton = page.locator('div#checkout-info button').first()
        this.continueButton = page.locator('div#checkout-info button').last() 
    }

    async getEmailInputValues(){
        return await this.emailInput.getAttribute('value')
    }
    async getFistNameInputValues(){
        return await this.firstNameInput.getAttribute('value')
    }
    async getLastNameInputValues(){
        return await this.lastNameInput.getAttribute('value')
    }
    async getZipCodeInputValues(){
        return await this.zipCodeInput.getAttribute('value')
    }

    async navigateToCheckoutOverview(){
        await this.continueButton.click()
        await this.page.waitForURL('/ecommerce/checkout-overview')
    }

    async fillCheckoutInformation(firstName:string, lastName:string, zipCode:string){
        await this.firstNameInput.fill(firstName)
        await this.lastNameInput.fill(lastName)
        await this.zipCodeInput.fill(zipCode)
    }

    async expectDefaultValues(userEmail: string){
        const emailValue = await this.getEmailInputValues()
        await expect(emailValue).toEqual(userEmail)

        // First name, Last name, Zip code in default value
        await expect(this.firstNameInput).toBeEmpty()
        await expect(this.lastNameInput).toBeEmpty()
        await expect(this.zipCodeInput).toHaveValue('1207')
    }
}