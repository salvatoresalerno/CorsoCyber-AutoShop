
 
import { EncryptJWT, jwtDecrypt, jwtVerify, SignJWT, errors as joseErrors } from 'jose';
import { getEncryptionKey, getSigningKey } from '../keys';
import { randomBytes } from 'crypto';
import { poolConnection } from '..';
import { User, UserRefresh } from '../types/types';

export const generateToken = async (user: User): Promise<string> => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
  }; 
    
  const signedToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1min') // Token valido per 1 ora
    .sign(getSigningKey());

  // Cripta il token firmato
  const encryptedToken = await new EncryptJWT({ token: signedToken })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .encrypt(getEncryptionKey());

  return encryptedToken;  
};



export async function verifyJWT(encryptedJWT: string) {
  try {
    
    const encryptionKey = getEncryptionKey(); 
    const {payload: payloadJwt} = await jwtDecrypt(encryptedJWT, encryptionKey); // dalla decriptazione ottengo il jwt di autenticazione da verificare la firma

    const signingKey = getSigningKey();

    const { payload } = await jwtVerify(payloadJwt["token"] as string, signingKey, {
      //issuer: 'urn:example:issuer',
      //audience: 'urn:example:audience',
    });

    //se esiste payload --> tutto ok, se errore --> avvio processo refresh token 

    return {
      payload,
      error: null
    }
    
  } catch (err: unknown) {
    if (err instanceof joseErrors.JWTExpired) {
      return {
        payload: err.payload,  //passo il payload perche il token è valido anche se scaduto, cosi dopo il refresh non ripeto la richiesta
        error: "JWTExpired"    //con il nuovo token ma completo quella già iniziata prima del refresh
      }
    } else {
      return {
        payload: null,
        error: "errore di decodifica"
      }
    }
  }
}

/*
codici: 
- ERR_JWE_INVALID  --> token corrotto
- ERR_JWT_EXPIRED --> token scaduto
*/





export const generateRefreshToken = (): string => {
  return randomBytes(32).toString('hex');
};


export const addRefreshToken = async (refreshToken: string, refreshTokenExpired: Date, user_id: string) => {
  try {
    const query = "UPDATE session SET refresh_token=?, refresh_token_exp=? WHERE user_id=?";
    const values = [refreshToken, refreshTokenExpired, user_id];

    await poolConnection.execute(query, values);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getRefreshToken = async (user_id:string) => {  

  try {
      const query = "SELECT refresh_token, refresh_token_exp FROM session WHERE user_id=?";    
      const values = [user_id]
      
      const [result] = await poolConnection.execute(query, values);

      return (result as UserRefresh[])[0] ?? null
      
  } catch (error) {
      return {
        refresh_token: null,
        refresh_token_exp: null
      }; 
  } 
}
 

