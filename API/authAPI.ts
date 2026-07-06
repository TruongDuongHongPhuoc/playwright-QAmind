import { BaseApi } from "./baseAPI";

export class AuthAPI extends BaseApi{

    async login(email:string ,password:string){
        const data = {
            email,
            password
        }

        return await this.request.post("http://localhost:5000/api/login",{data})
    }
}