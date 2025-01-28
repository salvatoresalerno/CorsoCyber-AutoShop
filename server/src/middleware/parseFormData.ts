import formidable from 'formidable';
import { Request, Response, NextFunction } from 'express';
import { UPLOAD_DIR_AVATAR } from '..';
import path from 'path';
import fs from 'fs';

export const parseFormData = (PUBLIC_UPLOAD_PATH: string) => {

  const PUBLIC_UPLOAD_DIR = path.join(__dirname, `../../uploads/${PUBLIC_UPLOAD_PATH}`);

  return (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({
      uploadDir: PUBLIC_UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype, originalFilename }) => {
        const validMimetypes = ['image/jpeg', 'image/png', 'image/webp'];
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        const hasValidMimetype = !!mimetype && validMimetypes.includes(mimetype);
        const hasValidExtension =
          !!originalFilename && validExtensions.some((ext) => originalFilename.toLowerCase().endsWith(ext));

        return hasValidMimetype && hasValidExtension;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Errore nel parsing.' });
      }

      if (files.image) {
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;     
        
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = path.extname(imageFile.originalFilename || '').toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
          // Rimuovi il file caricato
          fs.unlinkSync(imageFile.filepath);
          return res.status(400).json({ error: 'Tipo di file non valido.' });
        }

        const relativePath = path
          .join(PUBLIC_UPLOAD_PATH, path.basename(imageFile.filepath))
          .replace(/\\/g, '/');

        req.files = {
          ...files,
          image: {
            ...imageFile,
            relativePath, // Questo è il percorso che salverai nel DB
          },
        };
      }

      req.body = fields; // Inserisco i fields in req.body
      next();
    });
  };
};






export const parseFormData2 = (req: Request, res: Response, next: NextFunction) => {

  const PUBLIC_UPLOAD_PATH = '/uploads/veicoli';

  const form = formidable({
    uploadDir: UPLOAD_DIR_AVATAR,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: ({ mimetype, originalFilename }) => {
      const validMimetypes = ['image/jpeg', 'image/png', 'image/webp'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

      const hasValidMimetype = !!mimetype && validMimetypes.includes(mimetype);
      const hasValidExtension =
        !!originalFilename && validExtensions.some((ext) => originalFilename.toLowerCase().endsWith(ext));

      return hasValidMimetype && hasValidExtension;
    },
  });

  form.parse(req, (err, fields, files) => {

    if (err) {
      return res.status(400).json({ error: 'Errore nel parsing.' });
    }     

    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      const relativePath = path.join(PUBLIC_UPLOAD_PATH, path.basename(imageFile.filepath)).replace(/\\/g, '/');
      
      req.files = {
        ...files,
        image: {
          ...imageFile,            
           relativePath // Questo è il percorso che salverai nel DB
        }
      }; 
    }
    req.body = fields; // inserisco i fields in req.body --> il mid. potra cosi validarli
    //req.files = files; // inserisco  files in  req.files per l'accesso ai file cosi da recuperarlo dalla req nel controller

    next();
  });
};
