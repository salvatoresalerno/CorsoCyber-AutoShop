

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mysql, { Pool, PoolOptions } from "mysql2/promise";
import cookieParser from 'cookie-parser';
import authRoutes from './routers/auth.routes';
import veicoliRoutes from './routers/veicoli.routes';
import cors from 'cors'; 
import fs from 'fs/promises';
import path from 'path'; 

 
export const UPLOAD_DIR = path.join(__dirname, 'uploads');  //dir per upload immagini veicoli 
 

dotenv.config({ path: '../.env' });

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cookieParser()); 
app.use(express.json());

(async () => {  //crea se non esise la directory per upload
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
})();

 

app.use(
  cors({
      origin: 'http://localhost:3000', 
      credentials: true, 
  })
);

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

 




app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port} test .ENV->DB_NAME=${process.env.DB_NAME}`);
});





