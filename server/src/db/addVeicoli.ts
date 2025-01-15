import { Connection, RowDataPacket } from "mysql2/promise";
import { DB } from "./DB";

const veicoli = DB.veicoli

export const insertVehicles = async (connection: Connection) => {
  try {      

    const checkDataQuery = 'SELECT 1 FROM veicoli LIMIT 1;';
    const [rows] = await connection.query<RowDataPacket[]>(checkDataQuery);

    if (rows.length === 0) {
        await connection.beginTransaction();

        for (const veicolo of veicoli) {
            const query = `
                INSERT INTO veicoli 
                (brand, modello, tipo, anno, kilometri, alimentazione, prezzo, stato)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const values = [
                veicolo.brand,
                veicolo.modello,
                veicolo.tipo,
                veicolo.anno,
                veicolo.kilometri,
                veicolo.alimentazione,
                veicolo.prezzo,
                veicolo.stato,
            ];
            await connection.execute(query, values);
        }

        await connection.commit();
        console.log("Dati inseriti con successo!");
    } 

    
       
  } catch (error) {
    console.error("Errore durante l'inserimento: ", error);
  }
};

 
