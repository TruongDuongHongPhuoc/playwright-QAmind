import { Locator } from "@playwright/test";
import { Course } from "../../models/local_models/course";

export class LocalCourseRow {

    readonly root: Locator

    constructor(root: Locator){
        this.root = root
    }

    get title(){
        return this.root.locator('td[data-label="Title"]')
    }

    get description(){
        return this.root.locator('td[data-label="Description"]')
    }

    get status(){
        return this.root.locator('td[data-label="Status"]')
    }

    get createdBy(){
        return this.root.locator('td[data-label="Created By"]')
    }

    get editButton(){
        return this.root.locator('div[class="actions"] > a[href]')
    }

    get deleteButton(){
        return this.root.locator('form button[class="danger"]')
    }

    async toCourse(): Promise<Course> {
        return {
            title: await this.title.textContent() ?? '',
            description: await this.description.textContent() ?? '',
            status: await this.status.textContent() ?? '',
            createBy: await this.createdBy.textContent() ?? ''
        }
    }
}