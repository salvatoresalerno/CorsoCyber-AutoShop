import { poolConnection } from "..";
import { User } from "../types/types";
 
type UserWithPwd = User & {
    password: string;
    banned: boolean;
}


export const findUserForLogin = async (email:string) => {  
     
    try {
        const query = `SELECT u.id, u.username, u.email, u.password, u.banned, r.role 
                       FROM users u 
                       JOIN user_roles r ON u.id = r.user_id
                       WHERE u.email=?;`;     
        const values = [email]
        const [result] = await poolConnection.execute(query, values);

        return result as UserWithPwd[];
    } catch (error) {
        console.log('errori: ', error)
        return null       
    }  
}

export const SetLoginDate = async (email:string) => {  
     
    try {

        const query = "UPDATE users SET last_sign_in_at = ? WHERE email = ?;";         
        const values = [new Date(), email]
        const [result] = await poolConnection.execute(query, values);

        console.log('result Date: ', result)

        return result;
    } catch (error) {
        console.log('errori: ', error)
        return null       
    }  
}


export const findUserById = async (id:string): Promise<User | null> => {  
     
    try {
        const query = `SELECT u.id, u.username, u.email, r.role 
                       FROM users u 
                       JOIN user_roles r ON u.id = r.user_id
                       WHERE u.id=?;`     
              
        const values = [id]
        const [result] = await poolConnection.execute(query, values);
        
        return (result as User[])[0] ?? null;
    } catch (error) {
        console.log('errori: ', error)
        return null
    }  
}


export const findUserForChangeRole = async (username:string): Promise<{id: string} | null> => {  
     
    try {
        const query = 'SELECT id FROM users WHERE username = ?;'     
              
        const values = [username]
        const [result] = await poolConnection.execute(query, values);
        
        return (result as {id:string}[])[0] ?? null;
    } catch (error) {
        console.log('errori: ', error)
        return null
    }  
}