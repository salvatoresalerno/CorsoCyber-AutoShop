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

export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")    // '&' --> '&amp;'
        .replace(/</g, "&lt;")     // '<' --> '&lt;'
        .replace(/>/g, "&gt;")     // '>' --> '&gt;'
        .replace(/"/g, "&quot;")   // '"' --> '&quot;'
        //.replace(/'/g, "&#39;")
        .replace(/`/g, "&#96;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");   // "'" --> '&#39;'
  }
  
  export function decodeEscapedHtml(encodedString: string): string {
    return encodedString
      .replace(/&amp;/g, "&")      // '&amp;' --> '&'
      .replace(/&lt;/g, "<")       // '&lt;' --> '<'
      .replace(/&gt;/g, ">")       // '&gt;' --> '>'
      .replace(/&quot;/g, '"')     // '&quot;' --> '"'
      //.replace(/&#39;/g, "'")      // '&#39;' --> "'"
      .replace(/&#x27;/g, "'")      // '&#x39;' --> "'"
      .replace(/&#96;/g, "'")      // '&#96;' --> "`"
      .replace(/&#x2F;/g, "/");    // '&#x2F;' --> '/'
  } 