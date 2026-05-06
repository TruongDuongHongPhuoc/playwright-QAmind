import { Page, Locator } from '@playwright/test'
import { BasePage } from './base_page'
import { Product } from '../models/product'

export class ProductPage extends BasePage{

    protected userEmailSpan: Locator
    protected logoutButton: Locator
    protected CardDivs: Locator 
    protected productNames: Locator
    protected orderButton: Locator
    protected orderOptionsDiv: Locator
    protected orderSearchInput: Locator
    readonly orderOptions = {
        atoz: "asc",
        ztoa: "dsc",
        priceLowToHigh:"low",
        priceHightToLow:"high"
    }

    cardName = (card: Locator) => card.locator('a.text-lg')
    cardPrice = (card: Locator) => card.locator('span.text-lg')
    orderOptionItems = () => this.orderOptionsDiv.locator('div[data-slot="command-item"]')

    constructor(page:Page){
        super(page)
        this.userEmailSpan = page.locator("span[class*=user-name]")
        this.logoutButton = page.getByRole('button', { name: 'Log out' })
        this.productNames = page.locator("a.text-lg")
        this.CardDivs = page.locator("div.group")
        this.orderButton = page.locator("button[role='combobox']")
        this.orderOptionsDiv = page.locator("div[role='dialog'][id^='radix']")
        this.orderSearchInput = page.locator('input[placeholder^="Search"]')
    }

    async goto(){
        await this.page.goto('https://practice.qabrains.com/ecommerce')
    }
    async log_out(){
        await this.click(this.userEmailSpan)
        await this.click(this.logoutButton)
    }

    async getEmailSpanText():Promise<string|null>{
        return this.get_text(this.userEmailSpan)
    }

    async getAllProductsName():Promise<string[]>{
        const count = await this.productNames.count()
        const Namelist:string[] = []
        for(let i = 0; i < count;i++){
            let name:string = (await this.get_text( await this.productNames.nth(i))) ?? ''
            Namelist.push(name)
        }
        return Namelist
    }


    async getProducts():Promise<Product[]>{
        const count = await this.CardDivs.count()
        const products: Product[] = []
        for (let i =0; i < count; i++){
            const cardDiv = this.CardDivs.nth(i)
            const product : Product = {
                name: (await this.cardName(cardDiv)?.textContent())!.trim() ||'',
                price: Number( (await this.cardPrice(cardDiv).textContent())!.replace('$',''))
            }
            products.push(product)
        }
        return products
    }

    async ClickOrderDropdown(){
        await this.click(this.orderButton)
    }
    
    // best to take option from the order options
    async clickOrderOptionsByValue(option:string){
        await this.click(this.orderOptionsDiv.locator('div[data-value="'+option+'"]'))
    }

    async fillOrderSearch(searchValue:string){
        await this.input(this.orderSearchInput,searchValue)
    }

    async getVisibleOrderOptionsText():Promise<string[]>{
        const textList:string[] = []
        const item = await this.orderOptionItems()
        const count:number = await item.count()
        
        for (let i =0; i < count; i++){
            const text = await this.get_text(item.nth(i)) ?? ""
            textList.push(text)
        }
        return textList
    }

}