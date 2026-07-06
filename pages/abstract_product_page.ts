import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base_page'
import { Product } from '../models/product'
import { ProductCard } from '../components/product_card'
import { HeaderComponent } from '../components/header'

export abstract class AbstractProductPage extends BasePage{

    protected cardDivs: Locator 
    protected productNames: Locator
    protected orderDropdownButton: Locator
    protected orderOptionsDiv: Locator
    protected orderSearchInput: Locator
    
    //Component injection
    readonly headerComponent: HeaderComponent

    //Test Data
    readonly orderOptions = {
        atoz: "asc",
        ztoa: "dsc",
        priceLowToHigh:"low",
        priceHighToLow:"high"
    }

    // Locator func
    orderOptionItems = () => this.orderOptionsDiv.locator('div[data-slot="command-item"]')
    
    async clickOrderOptionsByValue(option:string){
        await this.orderOptionsDiv.locator('div[data-value="'+option+'"]').click()
    }

    constructor(page:Page){
        super(page)
        this.productNames = page.locator("a.text-lg")
        this.cardDivs = page.locator("div.group")
        this.orderDropdownButton = page.locator("button[role='combobox']")
        this.orderOptionsDiv = page.locator("div[role='dialog'][id^='radix']")
        this.orderSearchInput = page.locator('input[placeholder^="Search"]')
        this.headerComponent = new HeaderComponent(page)
    }

    //common
    async goto(){
        await this.page.goto('https://practice.qabrains.com/ecommerce')
    }

    // Product related

    getCard(index:number){
        return new ProductCard(
            this.cardDivs.nth(index)
        )
    }

    async getProducts(): Promise<Product[]> {
        const count = await this.cardDivs.count()
        const products: Product[] = []
        
        for(let i = 0; i < count; i++){
            const card = this.getCard(i)
            products.push(await card.toProduct())
        }
        return products
    }

    async getAllProductsName():Promise<string[]>{
        const count = await this.productNames.count()
        const Namelist:string[] = []
        for(let i = 0; i < count;i++){
            let name:string = (await this.productNames.nth(i).textContent()) ?? ''
            Namelist.push(name)
        }
        return Namelist
    }

    async getProductCardByName(productName: string):Promise<ProductCard>{
        const count = await this.cardDivs.count()
        for (let index = 0; index < count; index++) {
            const card:ProductCard = await this.getCard(index)
            const nameProduct:string = await card.name.textContent() ?? ''
            if(nameProduct.includes(productName)){
                return card
            }   
        }

        throw new Error("Product Name:"+ productName +"NOT found")
    }

    async navigateToProductDetail(productName:string){
        const prod = await this.getProductCardByName(productName)
        await prod.name.click()
    }

    // ORDER RELATED

    async ClickOrderDropdown(){
        await this.orderDropdownButton.click()
    }

    async fillOrderSearch(searchValue:string){
        await this.orderSearchInput.fill(searchValue)
    }

    async getVisibleOrderOptionsText():Promise<string[]>{
        const textList:string[] = []
        const item = await this.orderOptionItems()
        const count:number = await item.count()
        
        for (let i =0; i < count; i++){
            const text = await item.nth(i).textContent() ?? ""
            textList.push(text)
        }
        return textList
    }

    async clickFavoriteProductByName(productName:string){
        const productCard = await this.getProductCardByName(productName)
        await productCard.favoriteButton.click()
    }

    async clickAddToCartByName(productName:string){
        const productCard = await this.getProductCardByName(productName)
        await productCard.CartButton.click()
    }

    async expectVisibleOrderOptions(search:string, expectedOptions:string[]){
        await this.ClickOrderDropdown()
        await this.orderSearchInput.fill(search)
        const visibleOptions = await this.getVisibleOrderOptionsText()

        await expect(visibleOptions.length).toBeGreaterThanOrEqual(expectedOptions.length)
        await expect(visibleOptions).toEqual(expect.arrayContaining(expectedOptions))
        await this.ClickOrderDropdown()
    }

    async expectFavoritedProduct(name:string){
        const productCard = await this.getProductCardByName(name)
        const styleText = await productCard.favoriteButton.getAttribute('Style')
        await expect(styleText).toContain('color: rgb(255, 0, 0);')
    }
}