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
}