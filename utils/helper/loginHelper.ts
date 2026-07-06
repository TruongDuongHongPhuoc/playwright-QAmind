import { LocalLoginPage } from "../../pages/local_page/L_login_page";
import { LoginPage } from "../../pages/login_page";

export class AuthHelper {
    constructor( private loginPage: LoginPage, private localLoginPage: LocalLoginPage){}

    async loginAsUser(){
       await this.loginPage.login(process.env.EMAIL!,process.env.PASSWORD!)
       await this.loginPage.waitForLoggedIn()
    }

    async loginAsUserOnLocal(){
        const testEmail = this.localLoginPage.userList.userEmail
        const testPassword = this.localLoginPage.userList.userPass
        await this.localLoginPage.login(testEmail,testPassword)
        await this.localLoginPage.waitForLogin()
    }

    async loginAsAdminOnLocal(){
        const testEmail = this.localLoginPage.userList.adminEmail
        const testPassword = this.localLoginPage.userList.adminPass
        await this.localLoginPage.login(testEmail,testPassword)
        await this.localLoginPage.waitForLogin()
    }

    async loginAsAuthorOnLocal(){
        const testEmail = this.localLoginPage.userList.authorEmail
        const testPassword = this.localLoginPage.userList.authorPass
        await this.localLoginPage.login(testEmail,testPassword)
        await this.localLoginPage.waitForLogin()
    }

}