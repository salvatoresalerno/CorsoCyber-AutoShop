import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {      
    const salt = await bcrypt.genSalt(10); // Genera un salt
    // Genera l'hash della password con il salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {     
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
};