import { LoginPage } from "../../pages/login_page";

export class AuthHelper {
    constructor( private loginPage: LoginPage){}

    async loginAsUser(){
       await this.loginPage.login(process.env.EMAIL!,process.env.PASSWORD!)
       await this.loginPage.waitForLoggedIn()
    }

}