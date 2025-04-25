
import pool from '@/lib/db/db';


// get all authenticated user 
export const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM auth_table  where archived_at is not null order by created_at , updated_at');
  return result.rows;
};


// add a new user 
export const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    'INSERT INTO auth_table (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows;  
};


// delete a user 
export const deleteUser = async (id:string)=>{

   const response = await pool.query('select 1 from auth_table where auth__user_id = $1 ',[id])
   if(response.rows.length === 0) {
      return response.rows
   }
    
   const result = await pool.query('update auth_table set archived_at = current_timestamp where auth__user_id = $1 retruning*',[id]);
   return result.rows
}