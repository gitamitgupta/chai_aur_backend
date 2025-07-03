// hold this i will learn oops in cpp than see this code 

class ApiError extends Error{
    constructor(
        statuscode,
        message="something went worng",
        errors=[],
        statck=""

    ){
        super(massege)
        this.statuscode=statuscode
        this.data=null
        this.message=message
        this.success=false
        this.errors=this.errors
        if(statcks){
            this.stack=statck
        }
        else{
            Error.captureStackTrace(this,this.construtor)
        }
    }
}


export {ApiError};