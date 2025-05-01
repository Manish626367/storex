import pool from "@/lib/db/db";

// add a new user 
export const createEmployee = async ( name : string , email: string, phoneNumber:string, employeeType:string,employeeStatus:string , addedBy:string) => {
 
    try {
        console.log("employeestatus" , employeeStatus)
      const result = await pool.query(
        'INSERT INTO employee (name ,email,phone_number , emp_type , status ,added_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [ name ,email,phoneNumber , employeeType , employeeStatus  ,addedBy] 
      );
      console.log("result -- ",result.rows[0])
      return result.rows;  
    } catch (error) {
       console.log(error)
       return null ;
    }
  };

  export const checkUserExistOrNot = async ( email: string) => {
 
    try {
      const result = await pool.query(
       `select * from employee where email = $1`
       ,[email]
      );

      return result.rowCount === 0;  
    } catch (error) {
       console.log(error)
       return null ;
    }
  };


//   export const getAllEmployees = async (status?: string , type?:string) => {
//     try {
//         let query = "SELECT * FROM employee";
//         const values= [];
//         let index = 1;
    
//         if (status) {
//           query += ` WHERE status = $${index++}`;
//           values.push(status);
//         }
//         if (type) {
//             query += ` WHERE emp_type = $${index++}`;
//             values.push(type);
//           }
    
//         const result = await pool.query(query, values);
//         return result.rows;
//       } catch (error) {
//         console.error(error);
//         throw error;
//       }
//   }

export const getAllEmployees = async () => {
    try {
        const query = "SELECT * FROM employee";
       
        const result = await pool.query(query);
        return result.rows;
      } catch (error) {
        console.error(error);
        throw error;
      }
  }



  export const editEmployeeDetails = async(name : string , email: string, phoneNumber:string, employeeType:string,employeeStatus:string,empId:string )=>{
          try {
               const result = await pool.query(`update employee set email=$1 , name = $2 , phone_number = $3 ,emp_type = $4 , status = $5 where emp_id = $6 returning*`,[email , name , phoneNumber ,employeeType,employeeStatus,empId ]) 
               console.log("edit emp result -- ",result.rows[0])
               return result.rows[0]
          } catch (error) {
            console.log(error)
          }
  }



