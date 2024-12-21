

import { body } from "express-validator";
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
    body("stato")
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(Stato)),
];



