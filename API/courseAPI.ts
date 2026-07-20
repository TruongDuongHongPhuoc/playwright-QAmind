import { BaseApi } from "./baseAPI";

export class CourseAPI extends BaseApi{

    async createCourse(title:string,description:string){
        const data = {
            title,
            description
        }

        return await this.request.post(process.env.LOCAL_BASE_URL!+"/api/courses", { data })
    }

    async deleteCourse(id:number){
        return await this.request.delete(`${process.env.LOCAL_BASE_URL}/api/course/${id}`)
    }
}
