/** @type {import('next').NextConfig} */

import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });


const nextConfig = {
    env: {        
        HOST_MAIL:process.env.HOST_MAIL,
        PORT_MAIL:process.env.PORT_MAIL,
        USER_MAIL:process.env.USER_MAIL,
        PASSWORD_MAIL:process.env.PASSWORD_MAIL,
        REFRESH_TOKEN_EXPIRY:process.env.REFRESH_TOKEN_EXPIRY,
      },
      images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',  //dominio backend per preview image in upload form
            port: '5000',  
            pathname: '/uploads/**', // Consenti solo i percorsi relativi specifici
            search: '',
          },
        ],
      },
    
    
};





export default nextConfig;
