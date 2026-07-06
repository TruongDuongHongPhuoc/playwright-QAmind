import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes, Routes } from "../../constant/routes";

export class LocalApprovalPage extends LocalBasePage{

    constructor(page:Page){
        super(page)
        
    }

    async getPendingApprovalCourseBy(title:string, description:string){
        const rootLocator = this.page.locator(`//tr[
                    td[@data-label="Pending Requests" and contains(., "${title}")]
                    and
                    td[@data-label="Description" and contains(., "${description}")]
                ]`)
        
        return{
            rootLocator,
            approveButton: rootLocator.locator('button.success'),
            rejectButton: rootLocator.locator('button.danger')
        }
    }
    
}