import pool from "@/lib/db/db";

// add a new user 
export const createEmployee = async ( name : string , email: string, phoneNumber:string, employeeType:string,employeeStatus:string , addedBy:string) => {
 
    try {
      const result = await pool.query(
        'INSERT INTO employee (name ,email,phone_number , emp_type , status , created_at , updated_at, archived_reason, archived_at , archived_by ,added_by) VALUES ($1,$2,$3,$4,$5,now(),now(),$6,$7,$8,$9) RETURNING *',
        [ name ,email,phoneNumber , employeeType , employeeStatus , null , null , null ,addedBy] 
      );
      return result.rows;  
    } catch (error) {
       console.log(error)
       return null ;
    }
  };

  export const checkUserExistOrNot = async ( email: string) => {
 
    try {
      const result = await pool.query(
       `select 1 from employee where email = $1`
       ,[email]
      );
      return result.rows;  
    } catch (error) {
       console.log(error)
       return null ;
    }
  };


