import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'
import { clickSortProduct } from '../../utils/helper/helper'

test.describe('user can sort the product', () => {

  test.beforeEach(async ({auth}) =>{
    await auth.loginAsUser()
  })
  // this test will be failed due to defect in website
  test('Verify that user can sort the product lists by name', async ({ productPage }) => {
    await clickSortProduct(productPage,productPage.orderOptions.atoz)
    const productlist = await productPage.getAllProductsName()
    const sortedList = [...productlist].sort((a,b) => a.localeCompare(b))
    await expect(productlist).toEqual(sortedList)
  })

  test('Verify that user can sort the product lists by price', async ({ productPage }) => {
    await clickSortProduct(productPage,productPage.orderOptions.priceHightToLow)
    let productList: Product[] = await productPage.getProducts()
    let sortedList: Product[] = [...productList].sort((a,b) => b.price - a.price)
    await expect(productList).toEqual(sortedList)
    await clickSortProduct(productPage,productPage.orderOptions.priceLowToHigh)
    productList = await productPage.getProducts()
    sortedList = sortedList.reverse()
    await expect(productList).toEqual(sortedList)
  })

  // 🤡 this test intentionall making pass as part of system behavior However this behavior should have ticket to improve
  test('Verify that user can search for orders type', async ({ productPage }) => {

    await productPage.ClickOrderDropdown()
    await productPage.fillOrderSearch('A')
    let visibleOrderOption:string[] = await productPage.getVisibleOrderOptionsText()
    await expect(visibleOrderOption.length).toBeGreaterThan(0)
    await expect(visibleOrderOption).toContain("A to Z (Ascending)")
    
    await productPage.fillOrderSearch('d')
    visibleOrderOption = await productPage.getVisibleOrderOptionsText()
    await expect(visibleOrderOption.length).toBeGreaterThan(0)
    await expect(visibleOrderOption).toContain("Z to A (Descending)")

    await productPage.fillOrderSearch('s')
    visibleOrderOption = await productPage.getVisibleOrderOptionsText()
    await expect(visibleOrderOption.length).toBeGreaterThan(0)
    await expect(visibleOrderOption).toContain("Z to A (Descending)")
    await expect(visibleOrderOption).toContain("A to Z (Ascending)")

    await productPage.fillOrderSearch('High')
    visibleOrderOption = await productPage.getVisibleOrderOptionsText()
    await expect(visibleOrderOption.length).toBeGreaterThan(0)
    await expect(visibleOrderOption).toContain("High to Low (Price)")

    await productPage.fillOrderSearch('Low')
    visibleOrderOption = await productPage.getVisibleOrderOptionsText()
    await expect(visibleOrderOption.length).toBeGreaterThan(0)
    await expect(visibleOrderOption).toContain("Low to High (Price)")

    await productPage.fillOrderSearch('123')
    visibleOrderOption = await productPage.getVisibleOrderOptionsText()
    await expect(visibleOrderOption.length).toEqual(0)
  })

})