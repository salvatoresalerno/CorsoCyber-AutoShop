



import { Request, Response, NextFunction } from 'express';

export const validateRecaptcha = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  const recaptchaToken = req.body.tREC;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // Verifica se il token è stato fornito
  if (!recaptchaToken) {
    res.status(400).json({ 
        message: "", 
        error:  'Dati non validi!'
    });
    return;
  }

  try {
    // Chiamata all'API di Google per la verifica del token
    /* const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await fetch(recaptchaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey!,
          response: recaptchaToken,
        }),
      });


    const data = await response.json();

    console.log('data REC: ',data )

    if (!data.success || data.score < 0.5) {
        res.status(403).json({ message: "", error: "Verifica reCAPTCHA fallita" });
        return;
    }*/

    delete req.body.tREC;

    // Se il token è valido, passa al middleware successivo
    next();
  } catch (error) {
      console.error("Errore reCAPTCHA:", error);
      res.status(500).json({ message: "", error: "Errore nella verifica reCAPTCHA" });
      return;
  }
};

// export default validateRecaptcha;




/* import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY; // Chiave segreta di Google

export const validateRecaptcha = [ 

  body("tREC")
    .trim()
    .notEmpty()
    .withMessage("Il token reCAPTCHA è obbligatorio")
    .isString()
    .withMessage("Il token reCAPTCHA deve essere una stringa"),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);   

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: "", 
          error:  'Dati non validi!'
      })
    }


    try {
      const { tREC } = req.body;
      const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;

      const response = await fetch(recaptchaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET!,
          response: tREC,
        }),
      });

      const data = await response.json();
      
      if (!data.success || data.score < 0.5) {
        return res.status(403).json({ message: false, error: "Verifica reCAPTCHA fallita" });
      }

      console.log("reCAPTCHA verificato con successo!");

      //Rimuove tREC dal body così valido solo i parametri del form
      delete req.body.recaptchaToken;

      next(); // Passa al middleware successivo
    } catch (error) {
      console.error("Errore reCAPTCHA:", error);
      return res.status(500).json({ message: "", error: "Errore nella verifica reCAPTCHA" });
    }
  },
]; */








/*import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY; // Chiave segreta di Google

//export const validateRecaptcha = [

 export const validateRecaptcha = async (req: Request, res: Response, next: NextFunction) : Promise<void>=> {
  //validazione token reCAPTCHA
  body("tREC")
    .trim()
    .notEmpty()
    .withMessage("Il token reCAPTCHA è obbligatorio")
    .isString()
    .withMessage("Il token reCAPTCHA deve essere una stringa"),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "", 
        error:  'Dati non validi!'
    });
    }

    try {
      const { tREC } = req.body;
      const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;
      
      const response = await fetch(recaptchaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET!,
          response: tREC,
        }),
      });

      const data = await response.json();
     
      if (!data.success || data.score < 0.5) {
        return res.status(403).json({ message: "", error: "Verifica reCAPTCHA fallita" });
      }

      console.log("reCAPTCHA verificato con successo!");

      //Rimuove tREC dal body così valido solo i parametri del form
      delete req.body.tREC;

      next(); 
    } catch (error) {
      console.error("Errore reCAPTCHA:", error);
      return res.status(500).json({ message: "", error: "Errore nella verifica reCAPTCHA" });
    }
  }
} */

