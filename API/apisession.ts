import { APIRequestContext } from "@playwright/test";
import { AuthAPI } from "./authAPI";
import { BaseApi } from "./baseAPI";
import { CourseAPI } from "./courseAPI";

export class APISession extends BaseApi{

    readonly authAPI: AuthAPI
    readonly courseAPI: CourseAPI
    
    
    constructor(requestContext: APIRequestContext){
        super(requestContext)

        this.authAPI = new AuthAPI(requestContext)
        this.courseAPI = new CourseAPI(requestContext)
    }

    async deleteCourse(CourseID:number){
        await this.authAPI.login(process.env.LOCAL_ADMIN_EMAIL!,process.env.LOCAL_ADMIN_PASSWORD!)
        await this.courseAPI.deleteCourse(CourseID)
    }
}