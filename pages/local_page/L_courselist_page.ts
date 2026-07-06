import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes } from "../../constant/routes";
import { LocalCourseRow } from "../../components/local_components/local_course_row";

export class LocalCourseListPage extends LocalBasePage{
    readonly createCourseButton: Locator

    constructor(page:Page){
        super(page)
        this.createCourseButton = page.locator('a[class="button"][href="/courses/create"]')
    }

    readonly flashNotification = {
        courseCreateSuccess: "Course saved successfully.",
    }

    async getCourseRowBy(title:string, description:string):Promise<LocalCourseRow>{
        const rootLocator = this.page.locator(
            `//tr[
                td[@data-label="Title" and contains(., "${title}")]
                and
                td[@data-label="Description" and contains(., "${description}")]
            ]`
        );
        
        return new LocalCourseRow(rootLocator)
    }

    async confirmDeleteCourse(){
        await this.page.once('dialog', async diaglog =>{
            await diaglog.accept();
        })
    }

    async cancelDeleteCourse(){
        await this.page.on('dialog', async diaglog =>{
            await diaglog.dismiss();
        })
    }

    async waitforNavigate(){
        await this.page.waitForURL(LocalRoutes.createCoursePage)
    }
}