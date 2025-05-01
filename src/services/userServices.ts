
import pool from '@/lib/db/db';


// get all authenticated users 
export const getAllUsers = async () => {
   try {
    const result = await pool.query('SELECT * FROM auth_table  where archived_at is null order by created_at , updated_at');
    return result.rows;
   } catch (error) {
      console.log(error)
      return null 
   }
};


// add a new user 
export const createUser = async ( email: string , addedBy:string) => {
 
  try {
    const result = await pool.query(
      'INSERT INTO auth_table (email,created_at , updated_at ,added_by) VALUES ($1,now(),now(), $2) RETURNING *',
      [ email,addedBy] 
    );
    return result.rows;  
  } catch (error) {
     console.log(error)
     return null ;
  }
};


// delete a authenticated user 
export const deleteUser = async (userId:string , activeUserId : string, email:string )=>{
  try {
   console.log("userId -- ",userId , "activeuserid --",activeUserId , "email --- ",email)
   const result = await pool.query('update auth_table set archived_at = current_timestamp , deleted_by = $1 where auth_user_id = $2 returning*',[activeUserId,userId]);
   const getUserId = await pool.query(`select id from users where email = $1`,[email]);
   await pool.query(`delete from sessions where "userId" = $1`,[getUserId.rows[0].id]);
   console.log("result -- ",result)
   return result.rows 

  } catch (error) {
      console.log(error)
      return null ;
  }
}