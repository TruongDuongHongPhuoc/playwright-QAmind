import { LoginPage } from "../../pages/login_page";

export class AuthHelper {
    constructor( private loginPage: LoginPage){}

    async loginAsUser(){
        await this.loginPage.goto()
        await this.loginPage.fill_email(process.env.EMAIL!)
        await this.loginPage.fill_password(process.env.PASSWORD!)
        await this.loginPage.click_login()
        await this.loginPage.waitForLoggedIn()
    }

    async login(userName: string, password: string){
        await this.loginPage.goto()
        await this.loginPage.fill_email(userName)
        await this.loginPage.fill_password(password)
        await this.loginPage.click_login()
        await this.loginPage.waitForLoggedIn()
    }
}