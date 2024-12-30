

import dotenv from "dotenv"; 

dotenv.config({ path: '../.env' });


//let secretKey = process.env.JWT_SECRET || "";
let secretKey = process.env.SECRET_JWT || "";



export const getSigningKey = (): Uint8Array => {  //chiave firma jwt
  const signInKey = new TextEncoder().encode(
    secretKey
  );
  return signInKey;
};

export const getEncryptionKey = (): Uint8Array => {  //chiave encrypt payload
  const encryptionKey = Buffer.from(secretKey, 'utf-8').subarray(10, 42);
  
  return encryptionKey;
};


