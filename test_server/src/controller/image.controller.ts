
import { Request, Response, NextFunction } from  'express';
import formidable, { Fields, Files } from 'formidable';
import { poolConnection, UPLOAD_DIR } from '../index';
import { Stato, Veicolo, VeicoloParams } from '../types/types';

/* type FormidableRequest = Request & {
    files?: Files;
    fields?: Fields;
};

 

export const uploadImage = async (req: FormidableRequest, res: Response) => {
    const form = formidable({
        uploadDir: UPLOAD_DIR, // Directory di destinazione
        keepExtensions: true, // Conserva le estensioni originali
        maxFileSize: 5 * 1024 * 1024, // Limite di 5 MB
        filter: ({ mimetype }) => !!mimetype && mimetype.startsWith('image/'), // Accetta solo immagini
      });
    
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Errore durante il caricamento:', err.message);
          return res.status(400).json({ error: 'Errore durante il caricamento del file' });
        }
    
        const uploadedFile = files.image;
        // Verifica che il file esista e sia valido
        if (!uploadedFile || Array.isArray(uploadedFile)) {
          return res.status(400).json({ error: 'Nessun file fornito o tipo di file non valido' });
        }
    
        res.status(200).json({
          message: 'Upload completato con successo',
          file: {
            name: uploadedFile.originalFilename,
            path: uploadedFile.filepath,
            size: uploadedFile.size,
            type: uploadedFile.mimetype,
          },
        });
      });
} */

      interface CustomFile extends File {
        originalFilename?: string;
        filepath: string;
        mimetype: string;
      }

      export const uploadImage = async (req: Request, res: Response) => {
        const form = formidable({
            uploadDir: UPLOAD_DIR,
            keepExtensions: true,
            filter: ({ mimetype }) => !!mimetype && mimetype.startsWith('image/'),
        });

        form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
            if (err) {
              console.error('Error parsing the form:', err);
              res.status(500).json({ error: 'Failed to upload image' });
              return;
            }
        
            // Accedi al file caricato (sostituire "fileFieldName" con il nome del campo del form)
            const uploadedFile = files.image as CustomFile | CustomFile[] | undefined;
        
            // Verifica se il file esiste ed è singolo
            if (!uploadedFile || Array.isArray(uploadedFile)) {
              res.status(400).json({ error: 'No valid file uploaded' });
              return;
            }
            

        
            // Rispondi con i dettagli del file
            res.status(200).json({
              file: {
                name: uploadedFile.originalFilename || 'unknown',
                path: uploadedFile.filepath,
                size: uploadedFile.size,
                type: uploadedFile.mimetype,
              },
            });
          });
      };
 


