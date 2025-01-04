import formidable from 'formidable';
import { Request, Response, NextFunction } from 'express';
import { UPLOAD_DIR } from '..';
import path from 'path';

type UploadedFile = formidable.File & { relativePath?: string };  //aggiunta props relativePath per path relativa
//type UploadedFile = File & { relativePath?: string };  //aggiunta props relativePath per path relativa
/* interface FileWithRelativePath extends formidable.File {
  relativePath: string;
} */


export const parseFormData = (req: Request, res: Response, next: NextFunction) => {

  const PUBLIC_UPLOAD_PATH = '/uploads';

  const form = formidable({
    uploadDir: UPLOAD_DIR,
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

    console.log('fields: ', fields)
    console.log('files: ', files)


    if (err) {
      return res.status(400).json({ error: 'Errore nel parsing.' });
    }     

    console.log('upload DIR: ', UPLOAD_DIR)
    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

        const relativePath = path.join(PUBLIC_UPLOAD_PATH, path.basename(imageFile.filepath)).replace(/\\/g, '/');
      console.log('relative: ', relativePath)
      req.files = {
        ...files,
        image: {
          ...imageFile,            
           relativePath // Questo è il percorso che salverai nel DB
        }
      };    
      /* if (imageFile && 'filepath' in imageFile) {
        // Costruisci il percorso relativo
        const relativePath = path
          .join(PUBLIC_UPLOAD_PATH, path.basename(imageFile.filepath))
          .replace(/\\/g, '/'); // Sostituisce backslash con forward slash per compatibilità

        // Aggiungi il percorso relativo al file
        req.files = {
          ...files,
          image: {
            ...imageFile,
            relativePath, // Questo è il percorso che salverai nel DB
          } //as FileWithRelativePath,
        }; */
    }
     





    req.body = fields; // inserisco i fields in req.body --> il mid. potra cosi validarli
    //req.files = files; // inserisco  files in  req.files per l'accesso ai file cosi da recuperarlo dalla req nel controller

    next();
  });
};
