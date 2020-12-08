export class ApiResponse {
    status: string;
    statusCode: number;
    massage: string | null;


    constructor(status:string, statusžCode: number, massage: string | null = null ){
        this.status = status;
        this.statusCode = statusžCode;
        this.massage = massage;
    }

}
