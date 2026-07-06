import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes, Routes } from "../../constant/routes";
import { LocalCourseForm } from "../../components/local_components/local_course_form";

export class LocalCreateCoursePage extends LocalBasePage{
    readonly courseForm = new LocalCourseForm(this.page.locator('form[class]'))

    constructor(page:Page){
        super(page)
    }

    async waitforNavigate(){
        await this.page.waitForURL(LocalRoutes.createCoursePage)
    }
}