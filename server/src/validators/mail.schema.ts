import { body } from "express-validator";
import { Alimentazione } from "../types/types";

export const infoValidator = [
  body("nome")      
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
    .matches(/^[a-zA-Z0-9]+$/).withMessage("Username deve contenere solo lettere e numeri")
    .escape(),
  body("email")
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail()    
    .isLength({max: 255}).withMessage('La mail deve essere lunga max 255 caratteri'),
  body("telefono")
    //.optional()
    .isString()
    .trim()
    .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo telefono non è valido")
    .escape(), 
  body("messaggio")      
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isLength({ min: 1, max: 500 }).withMessage("Messaggio deve essere da 1 a 500 caratteri")
    .escape(),
]


export const orderValidator = [

  body("username")      
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
    .matches(/^[a-zA-Z0-9]+$/).withMessage("Username deve contenere solo lettere e numeri")
    .escape(),
  body("brand")
    .isString()
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isLength({max: 20 }).withMessage("Brand deve essere max 20 caratteri")
    .escape(),
  body("modello")    
    .isString()
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isLength({max: 20 }).withMessage("Modello deve essere max 20 caratteri")
    .escape(),
  body("alimentazione")
    .isString()
    .trim()
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isIn(Object.values(Alimentazione)),
  body("anno")
    .notEmpty().withMessage('Il campo non può essere vuoto')
    .isInt({min: 1900, max: 2100 }), 
]


