import { expect } from "@playwright/test";
import { test } from "@playwright/test";
import { CheckoutOverviewPage } from "../pages/CheckoutOverview";
import { Product } from "../models/product";


export async function expectCheckoutOverviewMatchCartProducts(checkoutOverviewPage: CheckoutOverviewPage, Cartproducts: Product[])
{
    await test.step("Verify checkout overview display match product from cart",async() => {
        for(const product of Cartproducts){
            const checkoutProd = await checkoutOverviewPage.getProductCardByName(product.name)

            const checkoutProdObj = await checkoutProd.toProduct()
        
            await expect(checkoutProdObj).toEqual(product)
        };
    })
}
export async function expectPricesCalculateCorrectly(checkoutOverviewPage: CheckoutOverviewPage, Cartproducts: Product[])
{
    await test.step("Verify total prices, tax, total price after tax is calculated correctly",async() => {
        let totalPrice = 0
        for(const product of Cartproducts){
            totalPrice += Number(product.totalPrice ?? 0) 
        };

        const taxPrice = Number((totalPrice * 0.05).toFixed(2))
        const totalPriceWithTax = Number((totalPrice + taxPrice).toFixed(2))
            
        await expect(checkoutOverviewPage.itemTotalSpan).toContainText(totalPrice.toString())
        await expect(checkoutOverviewPage.taxSpan).toContainText(taxPrice.toString())
        await expect(checkoutOverviewPage.totalAfterTaxSpan).toContainText(totalPriceWithTax.toString())
    })
}



