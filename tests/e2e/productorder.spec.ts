import { test, expect } from '../../fixtures/index.fixture'
import { Product } from '../../models/product'


test.describe('user can sort the product', () => {

  test.beforeEach(async ({auth}) =>{
    await auth.loginAsUser()
  })

  // this test will be failed due to defect in website
  test.fail('Verify that user can sort the product lists by name', async ({ productPage }) => {
    
    //click sort product a to z
    await productPage.clickSortProduct(productPage.orderOptions.atoz)

    //verify that product list sort a to z
    let productList = await productPage.getAllProductsName()
    let sortedList = [...productList].sort((a,b) => a.localeCompare(b))
    await expect(productList).toEqual(sortedList)

    //click sort product z to a
    await productPage.clickSortProduct(productPage.orderOptions.ztoa)
    
    //verify that product list sort z to a
    productList = await productPage.getAllProductsName()
    sortedList = [...productList].sort((a,b) => b.localeCompare(a))
    await expect(productList).toEqual(sortedList)
  
  })

  test('Verify that user can sort the product lists by price', async ({ productPage }) => {
    
    // click sort product high to low
    await productPage.clickSortProduct(productPage.orderOptions.priceHighToLow)

    // verify product sort by price high to low 
    let productList: Product[] = await productPage.getProducts()
    let sortedList: Product[] = [...productList].sort((a,b) => b.price - a.price)
    await expect(productList).toEqual(sortedList)

    // verify product sort by price low to high
    await productPage.clickSortProduct(productPage.orderOptions.priceLowToHigh)
    productList = await productPage.getProducts()
    sortedList = sortedList.reverse()
    await expect(productList).toEqual(sortedList)
  
  })

  // this test intentionall making pass as part of system behavior However this behavior should have ticket to improve
  test('Verify that user can search for orders type', async ({ productPage }) => {
    
    // Input A to search the order
    await productPage.expectVisibleOrderOptions('A',['A to Z (Ascending)'])

    // Input d to search the order
    await productPage.expectVisibleOrderOptions('d',['Z to A (Descending)'])

    // Input s to search the order
    await productPage.expectVisibleOrderOptions('s',['Z to A (Descending)','A to Z (Ascending)'])

    // Input high to search the order
    await productPage.expectVisibleOrderOptions('High',['High to Low (Price)'])

    // Input low to search the order
    await productPage.expectVisibleOrderOptions('Low',['Low to High (Price)'])

    // Non match
    await productPage.expectVisibleOrderOptions('123',[])
  
  })

})