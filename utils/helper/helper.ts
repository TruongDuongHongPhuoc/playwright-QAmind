import { Product } from "../../models/product";


export async function getNumberFromString(text: string):Promise<number>{
        return Number(text.replace(/[^0-9.]/g,'')) ?? 0
}

export async function updateProductQuantity(product:Product, newQuantity:number) {
        product.quantity = newQuantity
        product.totalPrice = product.quantity * product.price
}