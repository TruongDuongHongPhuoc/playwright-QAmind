import { Product } from "../../models/product";
import * as fs from "node:fs";
import path from "path";

export async function getNumberFromString(text: string):Promise<number>{
        return Number(text.replace(/[^0-9.]/g,'')) ?? 0
}

export async function updateProductQuantity(product:Product, newQuantity:number) {
        product.quantity = newQuantity
        product.totalPrice = product.quantity * product.price
}

export function getTestFilePath(fileName: string): string {
    return path.resolve(process.cwd(), "test_data", "testFiles", fileName);
}

export function getDownloadPath(fileName:string):string {
        return path.resolve(process.cwd(),"test_data","downloadedFiles",fileName)
}

export function readCsvFile(filePath:string):string{
        return fs.readFileSync(filePath,"utf-8")
}