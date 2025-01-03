
import { Request, Response, NextFunction } from  'express';
import formidable, { Fields, Files } from 'formidable';
import { poolConnection, UPLOAD_DIR } from '../index';
import { Stato, Veicolo, VeicoloParams } from '../types/types';



 




export const uploadImage = async (req: Request, res: Response) => {
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

    console.log('upload: ', uploadedFile)

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





