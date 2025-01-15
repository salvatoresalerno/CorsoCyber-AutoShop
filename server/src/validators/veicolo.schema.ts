

import { body, CustomValidator, param  } from "express-validator";
import { Alimentazione, Stato, TipoVeicolo } from "../types/types";



export const filteredVeicoliValidator = [
    body('tipo')
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(TipoVeicolo)),
    body("brand")
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({max: 20 }).withMessage("Brand deve essere max 20 caratteri")
        .escape(),
    body("model")    
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({max: 20 }).withMessage("Modello deve essere max 20 caratteri")
        .escape(),
    body("alim")
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(Alimentazione)),
    body("anno")
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isInt({min: 1900, max: 2100 }), 
    body("km.valueA")
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isInt({min: 0, max: 400000 }), 
    body("km.valueB")
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isInt({min: 0, max: 400000 }),
    body("prezzo.valueA")
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isInt({min: 0, max: 100000 }),          
    body("prezzo.valueB")
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isInt({min: 0, max: 100000}),          
];


export const statoVeicoliValidator = [
    param("stato")
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(Stato)),
];


export const addVeicoloValidator = [  //valida i campi come array (formidable restituisce cosi dopo il parse)
    body('id')            
      .optional()
      .isArray({ max: 1 })
      .withMessage('Massimo 1 elemento')
      .customSanitizer((value:string[]) => value.map((item: string) => item.trim())) 
      .custom((value:string[]) => {
        if (value.length > 0) {
            const id = value[0]; 
            if (typeof id !== "string") {
                throw new Error("Il campo deve essere una stringa");
            }
            if (id.length === 0) {
                throw new Error("Il campo non può essere vuoto");
            }
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
              throw new Error('Formato parametro non valido.'); // RegEx per un UUID valido
            }  
        }
        return true;  
      }),
    body('tipo')   
      .isArray({ max: 1 })
      .withMessage("massimo 1 elemento")
      .customSanitizer((value: string[]) => value.map((item: string) => item.trim()))
      .custom((value: string[]) => {
        if (value.length > 0) {
          const tipo = value[0];
          if (!Object.values(TipoVeicolo).includes(tipo as TipoVeicolo)) {
            throw new Error('Tipo non valida');
          }
        }
        return true;
      })      
      .escape(), 
    body('brand')
      .isArray({ max: 1 })
      .withMessage("massimo 1 elemento")
      .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
      .custom((value:string[]) => {
          if (value.length > 0) {
              const brand = value[0]; 
              if (typeof brand !== "string") {
                  throw new Error("Il campo deve essere una stringa");
              }
              if (brand.length > 20) {
                  throw new Error("Brand deve essere max 20 caratteri");
              }
          }
          return true;  
      })
      .escape(),
    body('model')
      .isArray({ max: 1 })
      .withMessage("massimo 1 elemento")
      .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
      .custom((value:string[]) => {
        if (value.length > 0) {
            const model = value[0]; 
            if (typeof model !== "string") {
                throw new Error("Il campo deve essere una stringa");
            }
            if (model.length > 20) {
                throw new Error("Model deve essere max 20 caratteri");
            }
        }
        return true;  
      })
      .escape(),
    body('alim')  
      .isArray({ max: 1 })
      .withMessage("massimo 1 elemento")
      .customSanitizer((value: string[]) => value.map((item: string) => item.trim()))
      .custom((value: string[]) => {
        if (value.length > 0) {
          const alimentazione = value[0];
          if (!Object.values(Alimentazione).includes(alimentazione as Alimentazione)) {
            throw new Error('Alimentazione non valida');
          }
        }
        return true;
      })      
      .escape(),      
    body('anno')   
      .isArray({ max: 1 })  
      .withMessage('massimo 1 elemento')
      .custom((value:string[]) => {
        if (value.length > 0) {
            const anno = Number(value[0]); 
            if (typeof anno !== "number") {
                throw new Error("Il campo deve essere un numero");
            }
            if ((anno < 1900) || anno > 2100)  {
                throw new Error("Anno non valido");
            }
        }
        return true;  
    }),
    body('km')
      .isArray({ max: 1 })  
      .withMessage('massimo 1 elemento')
      .custom((value:string[]) => {
        if (value.length > 0) {
            const km = Number(value[0]); 
            if (typeof km !== "number") {
                throw new Error("Il campo deve essere un numero");
            }
            if ((km < 0) || km > 400000)  {
                throw new Error("Km non valido");
            }
        }
        return true;  
    }),      
    body('prezzo')  
      .isArray({ max: 1 })  
      .withMessage('massimo 1 elemento') 
      .custom((value:string[]) => {
        if (value.length > 0) {
            const prezzo = Number(value[0]); 
            if (typeof prezzo !== "number") {
                throw new Error("Il campo deve essere un numero");
            }
            if ((prezzo < 0) || prezzo > 100000)  {
                throw new Error("Prezzo non valido");
            }
        }
        return true;  
    }),
    body('image')   
      .optional()
      .isArray({ max: 1 })  
      .withMessage('massimo 1 elemento')
      .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))
      .custom((value:string[]) => {
        if (value.length > 0) {
            const model = value[0]; 
            if (typeof model !== "string") {
                throw new Error("Il campo deve essere una stringa");
            }
            if (model.length === 0) {
                throw new Error("image non può essere vuoto");
            }
        }
        return true;  
      })
      .escape(),
      
      
  ];

  
export const getVeicoloValidator = [
  param("id")      
      .trim()
      .isUUID()
      .withMessage('Formato parametro non valido.')
];

export const idValidatorBody = [
  body("id")      
      .trim()
      .isUUID()
      .withMessage('Formato parametro non valido.')
];




