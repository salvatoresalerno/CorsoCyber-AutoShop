import { poolConnection } from "..";
import { User } from "../types/types";
 
type UserWithPwd = User & {
    password: string;
}


export const findUserForLogin = async (email:string) => {  
     
    try {
        const query = `SELECT u.id, u.username, u.email, u.password, r.role 
                       FROM users u 
                       JOIN user_roles r ON u.id = r.user_id
                       WHERE u.email=? `;     
        const values = [email]
        const [result] = await poolConnection.execute(query, values);

        return result as UserWithPwd[];
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
                       WHERE u.id=?`        
        const values = [id]
        const [result] = await poolConnection.execute(query, values);
        
        return (result as User[])[0] ?? null;
    } catch (error) {
        console.log('errori: ', error)
        return null
    }  
}