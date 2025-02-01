 

import { body } from "express-validator";
import { Ruolo } from "../types/types";

export const logOutValidator = [
    body("id")
        .trim()
        .notEmpty()
        .isUUID()
]



export const signUpValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()    
        .isLength({max: 255}).withMessage('La mail deve essere lunga max 255 caratteri'),        
    body("username")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Username deve contenere solo lettere e numeri")
        .escape(),
    body("password")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 8 }).withMessage('La password deve essere minimo 8 caratteri')
        .matches(/[A-Z]/).withMessage('La password deve contenere almeno una lettera maiuscola')
        .matches(/[0-9]/).withMessage('La password deve contenere almeno un numero')
        //.matches(/[$!%=[\]#\-.\(\)]/).withMessage('La password deve contenere almeno un carattere speciale tra !$%=[]#-.( )'),
        .matches(/[\!\$\%\=\[\]\#\-\.\(\)]/).withMessage('La password deve contenere almeno un carattere speciale tra !$%=[]#-.()')
        .matches(/^[A-Za-z\d\!\$\%\=\[\]\#\-\.\(\)]+$/).withMessage('La password può contenere solo lettere, numeri e i caratteri speciali consentiti'),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Le password non corrispondono');
            }
            return true;
        }),
    body("ruolo")
        .optional({ nullable: true })
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(Ruolo)), 
];

export const updAdminValidator = [
    body("id")      
        .trim()
        .isUUID()
        .withMessage('Formato parametro non valido.'),
    body("email")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()    
        .isLength({max: 255}).withMessage('La mail deve essere lunga max 255 caratteri'),        
    body("username")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Username deve contenere solo lettere e numeri")
        .escape(),
    body("password")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 8 }).withMessage('La password deve essere minimo 8 caratteri')
        .matches(/[A-Z]/).withMessage('La password deve contenere almeno una lettera maiuscola')
        .matches(/[0-9]/).withMessage('La password deve contenere almeno un numero')
        //.matches(/[$!%=[\]#\-.\(\)]/).withMessage('La password deve contenere almeno un carattere speciale tra !$%=[]#-.( )'),
        .matches(/[\!\$\%\=\[\]\#\-\.\(\)]/).withMessage('La password deve contenere almeno un carattere speciale tra !$%=[]#-.()')
        .matches(/^[A-Za-z\d\!\$\%\=\[\]\#\-\.\(\)]+$/).withMessage('La password può contenere solo lettere, numeri e i caratteri speciali consentiti'),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Le password non corrispondono');
            }
            return true;
        }),
];


export const signInValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail()    
        .isLength({max: 255}).withMessage('La mail deve essere lunga max 255 caratteri'),
    body("password")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 8 }).withMessage('La password deve essere minimo 8 caratteri')
        .matches(/[A-Z]/).withMessage('La password deve contenere almeno una lettera maiuscola')
        .matches(/[0-9]/).withMessage('La password deve contenere almeno un numero')
        //.matches(/[$!%=[\]#\-.\(\)]/).withMessage('La password deve contenere almeno un carattere speciale tra !$%=[]#-.( )'),
        .matches(/[\!\$\%\=\[\]\#\-\.\(\)]/).withMessage('La password deve contenere almeno un carattere speciale tra !$%=[]#-.()')
        .matches(/^[A-Za-z\d\!\$\%\=\[\]\#\-\.\(\)]+$/).withMessage('La password può contenere solo lettere, numeri e i caratteri speciali consentiti'),
     body("role")
        .isString()
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isIn(Object.values(Ruolo)),     
];


export const refreshTokenValidator = [
    body('refreshToken')
        .exists().withMessage('refresh token è richiesto')
        .isString().withMessage('refresh token deve essere una stringa')
        .notEmpty().withMessage('refresh token non puo essere vuoto'),
];

export const changeRoleValidator = [    
    body("username")      
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Username deve contenere solo lettere e numeri")
        .escape(),
];