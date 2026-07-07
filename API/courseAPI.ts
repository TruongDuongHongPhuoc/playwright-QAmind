import { BaseApi } from "./baseAPI";

export class CourseAPI extends BaseApi{

    async createCourse(title:string,description:string){
        const data = {
            title,
            description
        }

        return await this.request.post("http://localhost:5000/api/courses", { data })
    }

    async deleteCourse(id:number){
        return await this.request.delete(`http://localhost:5000/course/${id}`)
    }
}