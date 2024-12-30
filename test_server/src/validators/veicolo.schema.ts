

import { body, CustomValidator  } from "express-validator";
import { Alimentazione, Stato, TipoVeicolo } from "../types/types";
import formidable from 'formidable';
import { UPLOAD_DIR } from "..";



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
    body("stato")
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(Stato)),
];


export const addVeicoloValidator = [  //valida i campi come array (formidable restituisce cosi dopo il parse)
    body('tipo')
      .isArray({ min: 1 }) 
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isIn(Object.values(TipoVeicolo))
      .withMessage('Tipo non valido'),
    body('brand')
      .isArray({ min: 1 })  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isLength({ max: 20 }).withMessage("Brand deve essere max 20 caratteri")
      .escape(),
    body('model')
      .isArray({ min: 1 })  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isLength({ max: 20 }).withMessage("Modello deve essere max 20 caratteri")
      .escape(),
    body('alim')
      .isArray({ min: 1 })  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isIn(Object.values(Alimentazione))
      .withMessage('Alimentazione non valida'),
    body('anno')
      .isArray({ min: 1 })  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isInt({ min: 1900, max: 2100 })
      .withMessage('Anno non valido'),
    body('km')
      .isArray({ min: 1 })  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isInt({ min: 0, max: 400000 })
      .withMessage('Km non valido'),
    body('prezzo')
      .isArray({ min: 1 })  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .custom((value) => value[0] && value[0].trim() !== '')  
      .withMessage('Il campo non può essere vuoto')
      .bail()
      .isInt({ min: 0, max: 100000 })
      .withMessage('Prezzo non valido'),
  ];


