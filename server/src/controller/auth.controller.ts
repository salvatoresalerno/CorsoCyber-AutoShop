
import { Request, Response } from  'express';
import { poolConnection } from '../index';
import bcrypt from 'bcrypt';
import { findUserById, findUserForLogin } from '../services/user.service';
import { addRefreshToken, generateRefreshToken, generateToken, getRefreshToken } from '../services/jwt.service';
import { Ruolo } from '../types/types';
import dotenv from "dotenv"; 

dotenv.config({ path: '../.env' });

const REFRESH_TOKEN_EXPIRY =  Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60 * 1000;  // 7 giorni


const hashPassword = async (password: string): Promise<string> => {      
    const salt = await bcrypt.genSalt(10); // Genera un salt
    // Genera l'hash della password con il salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {     
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
};

 
export const signUp = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const { email, password, username } = req.body;
        const query = `INSERT INTO users (email, password, username) VALUES (?, ?, ?);`;
        
        const hashedPassword = await hashPassword(password); 
        const values = [email, hashedPassword, username];   

        await poolConnection.execute(query, values);
 
        res.status(201).json({
            message: 'Utente resistrato correttamente!',
            error: ""
        }); 
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
         
        res.status(500).json({
            message: "",
            error: 'Errore durante la registrazione!'
        });
    }    
}




export const signInUser = async (req: Request, res: Response) => {
    const REFRESH_TOKEN_EXPIRY =  Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60 * 1000; // 7 giorni

    const { email, password, role } = req.body;
    
    const user = await findUserForLogin(email);

    if (user === null) {         
        res.status(200).json({ 
            errors:  'Errore Imprevisto, riprovare più tardi',
            message: null
        });          
        return;         
    }
    if (user && user.length === 0) {        
        res.status(200).json({ 
            errors:  'Credenziali Errate',
            message: null
        });         
        return;         
    }

    //blocco se accedo con ruolo errato (es. admin che accede nella sezione user o viceversa)
    if (((user[0].role === Ruolo.USER) && role === Ruolo.ADMIN) || ((user[0].role === Ruolo.ADMIN) && role === Ruolo.USER)){
        res.status(200).json({ 
            errors:  'Credenziali Errate',
            message: null
        }); 
        return   
    }
    
    const isValid = await verifyPassword(password, user[0].password);

    if (!isValid) {        
        res.status(200).json({ 
            errors:  'Credenziali Errate',
            message: null
        });
        return;         
    }
    
    const refreshToken = generateRefreshToken();
    const refreshTokenExpired = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);    
    await addRefreshToken(refreshToken, refreshTokenExpired, user[0].id);   //salvo sul db il ref.tok
       
    const token = await generateToken({ id: user[0].id, username: user[0].username, email: user[0].email, role: user[0].role });  //user come payload  

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',  
        path: '/',
        maxAge: REFRESH_TOKEN_EXPIRY,  
    });  
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',  
        path: '/',
        //maxAge: 3600000, // 1 ora -> senza scadenza (session)
    });  
  
    res.status(201).json({
        error: null,
        message: 'Login Ok'
    });
}


export const signInAdmin = async (req: Request, res: Response) => {

}


export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;  

    const { user_id, username, email, role } = req.body;

    if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token mancante.' });
        return;
    }

    const { refresh_token, refresh_token_exp } = await getRefreshToken(user_id);

    if (!refresh_token || !refresh_token_exp) {
        res.status(401).json({ error: 'Refresh token non valido o scaduto.' });
        return;
    }
    const now  = new Date()
    if (refresh_token_exp.getTime() <= now.getTime()) {  //token scaduto
        res.status(401).json({ error: 'Refresh token non valido o scaduto.' });
        return;
    }
    if (refreshToken !== refresh_token) {
        res.status(401).json({ error: 'Token non valido.' });
        return;
    } 
    
    //qui tutto ok, refreshToken valido --> rigenero i token

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenExpired = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);   
    await addRefreshToken(newRefreshToken, newRefreshTokenExpired, user_id); 
    
    const newToken = await generateToken({ id: user_id, username, email, role: role }); 

    res.status(200).json({ 
        message: 'Token aggiornati con successo.', 
        token: newToken,
        refreshToken: newRefreshToken
    });
}


export const getCurrentUser = async (req: Request, res: Response) => {
    const payload = req.payload;

    if(!payload) {
        res.status(200).json({ 
            errors:  'Errore Imprevisto, riprovare più tardi',
            user: null
        });  
        return
    }

    const user = await findUserById(payload.id);

    if (!user) {         
        res.status(200).json({ 
            errors:  'Errore Imprevisto, riprovare più tardi',
            user: null
        });          
        return;         
    }
    
    res.status(200).json({ 
        errors:  '',
        user: user
    });  
}

export const getAuth = async (req: Request, res: Response) => {
    const payload = req.payload;

    if(!payload) {
        res.status(200).json({ 
            errors:  'Errore Imprevisto, riprovare più tardi',
            isAuth: false
        });  
        return
    }
//potrei controllare presenza id nel db, per ora basta un payload valido
    res.status(200).json({ 
        errors:  '',
        isAuth: true
    });
    return
}


export const logout = async (req: Request, res: Response) => {
    try {
        const { id } = req.body

        const query = "UPDATE session SET  refresh_token = ?, refresh_token_exp = ? WHERE user_id = ?";
        const values = [null, null, id];   
        await poolConnection.execute(query, values);

        res.status(200).json({ 
            message: 'Logout effettuato con successo',
            error: null 
        });
        
    } catch (error) {
        res.status(200).json({ 
            message: null,
            error: 'errore durante il LogOut' 
        });
    }
};