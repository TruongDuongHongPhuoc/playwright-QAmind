import { Locator, Page } from "@playwright/test";
import { LocalBasePage } from "./base_page";
import { LocalRoutes, Routes } from "../../constant/routes";

export class LocalTableRowInstance{
    root: Locator

    constructor(root: Locator){
        this.root = root
    }

    get name(){
        return this.root.locator('td[data-label="Name"]')
    }

    async getNameText():Promise<string>{
        return (await this.name.textContent()) ?? ''
    }

    get status(){
        return this.root.locator('td[data-label="Status"]')
    }

    get createDate(){
        return this.root.locator('td[data-label="Created Date"]')
    }
}

export class LocalTablePage extends LocalBasePage{
    readonly searchField : Locator
    readonly statusFilterDropdown : Locator
    readonly nameSortDropdown : Locator
    readonly dateSortDropdown : Locator
    readonly rowsInstances: Locator
    readonly tableRoot: Locator

    readonly paginate = {
        previousButton: this.page.locator("button#previous-page"),
        nextButton: this.page.locator("button#next-page"),
        currentpage: this.page.locator("span#page-info"),
    }

    readonly statusFilterValues = {
        allStatus: "",
        active:"Active",
        inactive: "Inactive",
        pending: "Pending"
    }

    readonly nameSortValues = {
        default: "",
        accending:"asc",
        descending: "desc",
    }

    readonly dateSortValues = {
        default: "",
        accending:"asc",
        descending: "desc",
    }

    constructor(page:Page){
        super(page)
        this.searchField = page.locator('input#table-search')
        this.statusFilterDropdown = page.locator('select#status-filter')
        this.nameSortDropdown = page.locator("select#name-sort")
        this.dateSortDropdown = page.locator("select#date-sort")
        this.rowsInstances = page.locator("tbody#table-body tr")
        this.tableRoot = page.locator('table[id="demo-table"]')
    }
    

    async getRowInstances():Promise<LocalTableRowInstance[]>{
        const rowCount = await this.rowsInstances.count()
        const instances:LocalTableRowInstance[] = []

        for(let i =0; i < rowCount; i++){
            const row = new LocalTableRowInstance(this.rowsInstances.nth(i))
            instances.push(row)
        }
        return instances
    }

    async getNames(): Promise<string[]>{
        return await this.tableRoot.locator('td[data-label="Name"]').allTextContents()
    }

    async getDates(): Promise<string[]>{
        return await this.tableRoot.locator('td[data-label="Created Date"]').allTextContents()
    }

    async getIds(): Promise<string[]>{
        return await this.tableRoot.locator('td[data-label="ID"]').allTextContents()
    }
    
}