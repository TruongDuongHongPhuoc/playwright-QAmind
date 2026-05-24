import { Page, Locator } from '@playwright/test'
import { BasePage } from './base_page'
import { Product } from '../models/product'
import { ProductCard } from '../components/product_card'

export abstract class AbtractProductPage extends BasePage{

    protected userEmailSpan: Locator
    protected logoutButton: Locator
    protected CardDivs: Locator 
    protected productNames: Locator
    protected orderButton: Locator
    protected orderOptionsDiv: Locator
    protected orderSearchInput: Locator
    protected confirmLogOutButton: Locator

    readonly orderOptions = {
        atoz: "asc",
        ztoa: "dsc",
        priceLowToHigh:"low",
        priceHightToLow:"high"
    }

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
        this.confirmLogOutButton = page.locator('div[data-slot="dialog-footer"] > button').last()
        
    }

    getCard(index:number){
    return new ProductCard(
        this.CardDivs.nth(index)
    )
    }

    async getProducts(): Promise<Product[]> {

    const count = await this.CardDivs.count()

    const products: Product[] = []

    for(let i = 0; i < count; i++){

        const card = this.getCard(i)

        products.push(await card.toProduct())
    }

    return products
}

    async goto(){
        await this.page.goto('https://practice.qabrains.com/ecommerce')
    }
    async log_out(){
        await this.click(this.userEmailSpan)
        await this.click(this.logoutButton)
        await this.click(this.confirmLogOutButton)
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

    async getProductCardByName(productName: string):Promise<ProductCard>{
        const count = await this.CardDivs.count()
        for (let index = 0; index < count; index++) {
            const card:ProductCard = await this.getCard(index)
            const nameProduct:string = await card.name.textContent() ?? ''
            if(nameProduct.includes(productName)){
                return card
            }   
        }

        throw new Error("Product Name:"+ productName +"NOT found")
    }

    async clickFavoriteProductByName(productName:string){
       await this.click((await this.getProductCardByName(productName)).favoriteButton)
    }

    async clickAddToCartByName(productName:string){
        await this.click(((await this.getProductCardByName(productName)).CartButton))
    }
}