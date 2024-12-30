import formidable from 'formidable';
import { Request, Response, NextFunction } from 'express';
import { UPLOAD_DIR } from '..';

export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
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
    if (err) {
      return res.status(400).json({ error: 'Errore nel parsing.' });
    }     

    req.body = fields; // inserisco i fields in req.body --> il mid. potra cosi validarli
    req.files = files; // inserisco  files in  req.files per l'accesso ai file cosi da recuperarlo dalla req nel controller

    next();
  });
};
