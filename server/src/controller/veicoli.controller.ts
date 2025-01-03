
import { Request, Response, NextFunction } from  'express';
import { poolConnection } from '../index';
import { Stato, Veicolo, VeicoloParams } from '../types/types';
import { RowDataPacket } from 'mysql2';


export const getVeicoliStato = async (req: Request, res: Response): Promise<void>  => {


    const stato = req.params.stato
    try {
        let query = "";

        if (stato === Stato.TUTTI) {
            query = 'SELECT * FROM veicoli'; 
        } else {
            query = 'SELECT * FROM veicoli WHERE stato=?';  
        }

        //const query = 'SELECT * FROM veicoli WHERE stato=?';    
        const values = [stato];
        const [result] = await poolConnection.execute(query, values);
        
        res.status(201).json({
            data: result as Veicolo[],
            error: null
        }); 

    } catch (error) {
        //console.log('errori: ', error);
        res.status(500).json({
            data: "",
            error: 'Errore durante il recupero dei veicoli.'
        });     
    }  

}


export const getFilteredVeicoli = async (req: Request, res: Response): Promise<void>  => {    

    const params:VeicoloParams = req.body

    //faccio query senza prezzo, km, anno e alimentazione poi filtro i risultati con prezzo, km , anno e alimentazione e se 
    //esiste il veicolo esatto lo restituisco, altrimenti restituisco il risultato della query come veicoli suggeriti
    //con questo metodo faccio una sola query.
    try { 
        const query = `SELECT * FROM veicoli WHERE
            tipo = ? AND brand = ? AND modello = ?`;   // AND alimentazione = ? AND anno = ? `;
        const values = [params.tipo, params.brand, params.model];   

        const [result] = await poolConnection.execute(query, values);

        const veicoli = result as Veicolo[];
        
        if (veicoli.length === 0) {
            res.status(201).json({
                data: [],
                error: ""
            }); 
            return;
        }

        //filtro i veicoli per trovare corrispondenza con alimentazione, anno e i range di prezzo e km
        const veicoliFiltrati =  veicoli.filter((veicolo) => {

            const matchesAlim = params.alim ? veicolo.alimentazione === params.alim : true;
            const matchesAnno = params.anno ? veicolo.anno === params.anno : true;
            const matchesKm = params.km ? (veicolo.kilometri >= params.km.valueA && veicolo.kilometri <= params.km.valueB) : true;
            const matchesPrezzo = params.prezzo ? (veicolo.prezzo >= params.prezzo.valueA && veicolo.prezzo <= params.prezzo.valueB) : true;

            return matchesAlim && matchesAnno && matchesKm && matchesPrezzo;
        });

        if (veicoliFiltrati.length > 0) { //veicolo esatto trovato
            res.status(201).json({
                data: veicoliFiltrati,
                suggerito: false,
                error: ""
            });            
        } else {  //veicolo esatto non trovato, mando tutti come suggeriti 
            res.status(201).json({
                data: veicoli,
                suggerito: true,
                error: ""
            });
        }  
    } catch (error) {
        res.status(500).json({
            data: null,
            suggerito: false,
            error: 'Errore durante il recupero dei veicoli.'
        });
    }
}  



export const getBrand = async (req: Request, res: Response): Promise<void>  => {

    try {
        const query = 'SELECT DISTINCT brand FROM veicoli;';
        const [result] = await poolConnection.execute(query);

        //const brands = (result as RowDataPacket[]).map(row => row.brand);
        res.status(201).json({
            data: result,  //brands,             
            error: ""
        });  
        return;
    } catch (error) {
        res.status(200).json({
            data: null,             
            error: 'Errore durante il recupero dei veicoli'
        }); 
    }
}


export const getBrandAndModel = async (req: Request, res: Response): Promise<void>  => {

    try {
        const query = `SELECT brand,
            GROUP_CONCAT(DISTINCT modello ORDER BY modello SEPARATOR ', ') AS modelli
            FROM veicoli GROUP BY brand ORDER BY brand;`;

        const [result] = await poolConnection.execute(query);

        //const brands = (result as RowDataPacket[]).map(row => row.brand);
        res.status(201).json({
            data: result,             
            error: ""
        });  
        return;
    } catch (error) {
        res.status(200).json({
            data: null,             
            error: 'Errore durante il recupero dei veicoli'
        }); 
    }
}


export const addVeicolo = async (req: Request, res: Response) => {
    // I campi sono array in formidable (inseriti in req dopo il parse con il campo image)
    try {
  
      console.log('valori in req: ', req.body, req.files)
   
      const brand = req.body.brand?.[0];  
      const modello = req.body.model?.[0];
      const tipo = req.body.tipo?.[0];
      const alimentazione = req.body.alim?.[0];
      const anno = req.body.anno?.[0];
      const km = req.body.km?.[0];
      const prezzo = req.body.prezzo?.[0];
      const stato = Stato.VENDESI;
  
      const uploadedFile = req.files?.image?.[0].filepath;
  
      //salvo nel db tutti i dati:       
      const query = `INSERT INTO veicoli 
        (brand, modello, tipo, anno, alimentazione, kilometri, prezzo, stato, image)
        VALUES (?,?,?,?,?,?,?,?,?)`; 
       
      const values = [brand, modello, tipo, anno, alimentazione, km, prezzo, stato, uploadedFile ? uploadedFile : null];
  
      await poolConnection.execute(query, values);
      
      res.status(200).json({
        error: null,
        message: 'Veicolo aggiunto con successo'
      });
  
     
  
    } catch (error) {
      console.error('Errore in Aggiungi Veicolo:', error);
      res.status(500).json({
        error: 'Errore imprevisto in Aggiungi Veicolo',
        message: null
      });
    }
  };
