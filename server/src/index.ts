

import express, { Express } from "express";
import dotenv from "dotenv";
import mysql, { Pool, PoolOptions } from "mysql2/promise";
import cookieParser from 'cookie-parser';
import authRoutes from './routers/auth.routes';
import veicoliRoutes from './routers/veicoli.routes';
import userRoutes from './routers/user.routes';
import adminRoutes from './routers/admin.routes';
import cors from 'cors'; 
import fs from 'fs/promises';
import path from 'path'; 
import { InitializingDB } from "./db/init";

 

export const UPLOAD_DIR_VEICOLI = path.join(__dirname, '../uploads/veicoli');  //dir per upload immagini veicoli 
export const UPLOAD_DIR_AVATAR = path.join(__dirname, '../uploads/avatar');  //dir per upload avatar 


 
dotenv.config();
//dotenv.config({ path: '../.env' });

const app: Express = express();
const port = process.env.PORT || 5000;

//const apiBaseUrl_client = process.env.NEXT_API_URL;
const apiBaseUrl_client = process.env.ORIGIN_API_URL;

app.use(cookieParser()); 
app.use(express.json());

(async () => {  //crea se non esise la directory per upload veicoli e avatar
  await fs.mkdir(UPLOAD_DIR_VEICOLI, { recursive: true });
  await fs.mkdir(UPLOAD_DIR_AVATAR, { recursive: true });
})();

 console.log('ORIGIN: ', apiBaseUrl_client)

app.use(
  cors({
      origin: apiBaseUrl_client, //'http://localhost:3000', 
      credentials: true, 
      //allowedHeaders: ['Content-Type']
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); //midd per percorso immagini



//inizializzazione DB: creazione db, utente, privilegi user, tabelle, trigger, foreign key, add veicoli
(async () => {
  try {
       
      await InitializingDB();

      console.log("Database Pronto all'uso!");
  } catch (error) {
      console.error("Errore durante l'inizializzazione del database:", error);
      process.exit(1);  
  }
})(); 



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
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);



app.listen(port, () => {
  console.log(`[server]: Server is running at ${apiBaseUrl_client} - [port]:${port} test .ENV->DB_NAME=${process.env.DB_NAME}`);
});





