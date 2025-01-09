

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mysql, { Pool, PoolOptions } from "mysql2/promise";
import cookieParser from 'cookie-parser';
import authRoutes from './routers/auth.routes';
import veicoliRoutes from './routers/veicoli.routes';
import userRoutes from './routers/user.routes';
import cors from 'cors'; 
import fs from 'fs/promises';
import path from 'path'; 

 
//export const UPLOAD_DIR = path.join(__dirname, 'uploads');  //dir per upload immagini veicoli 
export const UPLOAD_DIR_VEICOLI = path.join(__dirname, '../uploads/veicoli');  //dir per upload immagini veicoli 
export const UPLOAD_DIR_AVATAR = path.join(__dirname, '../uploads/avatar');  //dir per upload avatar 


 
 

dotenv.config({ path: '../.env' });

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cookieParser()); 
app.use(express.json());

(async () => {  //crea se non esise la directory per upload
  await fs.mkdir(UPLOAD_DIR_VEICOLI, { recursive: true });
  await fs.mkdir(UPLOAD_DIR_AVATAR, { recursive: true });
})();

 

app.use(
  cors({
      origin: 'http://localhost:3000', 
      credentials: true, 
      //allowedHeaders: ['Content-Type']
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); //midd per percorso immagini

const poolConfig: PoolOptions = {
  waitForConnections: true,
  connectionLimit: 10,     
  host: process.env.DB_HOST as string,    
  user: process.env.DB_USER as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_USER_PASSWORD as string,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  //multipleStatements: true
};
export const poolConnection: Pool = mysql.createPool(poolConfig);



app.use("/api/auth", authRoutes);
app.use("/api/veicoli", veicoliRoutes);
app.use("/api/user", userRoutes)

 




app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port} test .ENV->DB_NAME=${process.env.DB_NAME}`);
});





