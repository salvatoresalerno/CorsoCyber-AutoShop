

import { body, param } from "express-validator";

export const usernameValidator = [
    param("username")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .escape(),    
];



export const profiloValidator = [   
    body("id")      
        .trim()
        .isUUID()
        .withMessage('Formato parametro non valido.'),
    body("nome")
        .optional()
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 50 }).withMessage("Nome deve essere max 50 caratteri")
        .escape(), 
    body("cognome")
        .optional()
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 50 }).withMessage("Cognome deve essere max 50 caratteri")
        .escape(), 
    body("via")
        .optional()
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 100 }).withMessage("Via deve essere max 100 caratteri")
        .escape(), 
    body("citta")
        .optional()
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 50 }).withMessage("Città deve essere max 50 caratteri")
        .escape(), 
    body("cap")
        .optional()
        .isString()
        .trim()
        .matches(/^\d{5}$/).withMessage("Il campo deve contenere esattamente 5 cifre")
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        //.isLength({ max: 5 }).withMessage("CAP deve essere max 5 numeri")
        .escape(), 
    body("provincia")
        .optional()
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 3 }).withMessage("Provincia deve essere max 3 caratteri")
        .escape(), 
    body("telefono")
        .optional()
        .isString()
        .trim()
        .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo telefono non è valido")
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        //.isLength({ max: 15 }).withMessage("Telefono deve essere max 15 caratteri separatore incluso")
        .escape(), 
    body("cellulare")
        .optional()
        .isString()
        .trim()
        .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo cellulare non è valido")
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        //.isLength({ max: 15 }).withMessage("Cellulare deve essere max 15 caratteri separatore incluso")
        .escape(), 
]



