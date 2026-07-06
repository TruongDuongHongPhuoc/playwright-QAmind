import { Locator } from "@playwright/test";

export class LocalCourseForm{

    private root: Locator
    readonly titleInput: Locator
    readonly descriptionInput: Locator
    readonly submitButton: Locator
    readonly cancelButton: Locator

    constructor(root: Locator){
        this.root = root
        this.titleInput = this.root.locator('input#title')
        this.descriptionInput = this.root.locator('textarea#description')
        this.submitButton = this.root.locator("button[type='submit']")
        this.cancelButton = this.root.locator('div[class="actions"] a[href="/courses"]')
    }

    async fill(title: string, description:string){
        await this.titleInput.fill(title)
        await this.descriptionInput.fill(description)
    }
}