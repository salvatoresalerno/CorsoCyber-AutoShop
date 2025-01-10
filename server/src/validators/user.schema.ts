

import { body, param } from "express-validator";

export const usernameValidator = [
    param("username")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .escape(),    
];

export const bannedValidatorBody = [
    body("id")      
        .trim()
        .isUUID()
        .withMessage('Formato parametro non valido.'),
    body("banned")
        .isIn([0, 1])
        .withMessage('Il campo Banned deve essere 0 (false) o 1 (true).'),
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
export const profiloValidator2 = [   
    body("id")  
        .isArray({ min: 1 })
        .withMessage('Il campo non può essere vuoto')
        .bail()     
        .trim()
        .custom((value) => value[0] && value[0].trim() !== '')  
        .withMessage('Il campo non può essere vuoto')
        .isUUID()
        .withMessage('Formato parametro non valido.'),
    body("nome")
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
        .custom((value:string[]) => {
            if (value.length > 0) {
                const nome = value[0]; 
                if (typeof nome !== "string") {
                    throw new Error("Il campo deve essere una stringa");
                }
                if (nome.length > 50) {
                    throw new Error("Nome deve essere max 50 caratteri");
                }
            }
            return true;  
        })
        .escape(), 

    /* body("nome")
        .optional()
        //.isArray({ min: 1 })
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 50 }).withMessage("Nome deve essere max 50 caratteri")
        .escape(),  */
    body("cognome")
        /* .optional()
        //.isArray({ min: 1 })
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 50 }).withMessage("Cognome deve essere max 50 caratteri")
        .escape(),  */
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
        .custom((value:string[]) => {
            if (value.length > 0) {
            const nome = value[0]; 
                if (typeof nome !== "string") {
                    throw new Error("Il campo deve essere una stringa");
                }
                if (nome.length > 50) {
                    throw new Error("Cognome deve essere max di 50 caratteri");
                }
            }
            return true;  
        })
        .escape(), 
    body("via")
        /* .optional()
        //.isArray({ min: 1 })
        .isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 100 }).withMessage("Via deve essere max 100 caratteri")
        .escape(),  */
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
        .custom((value:string[]) => {
            if (value.length > 0) {
            const nome = value[0]; 
                if (typeof nome !== "string") {
                    throw new Error("Il campo deve essere una stringa");
                }
                if (nome.length > 100) {
                    throw new Error("Via deve essere al massimo di 100 caratteri");
                }
            }
            return true;  
        })
        .escape(), 
    body("citta")
        /* .optional()
        .isArray({ min: 1 })
        .isString()
        //.trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 50 }).withMessage("Città deve essere max 50 caratteri")
        .escape(),  */
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
        .custom((value:string[]) => {
            if (value.length > 0) {
                const nome = value[0]; 
                if (typeof nome !== "string") {
                    throw new Error("Il campo deve essere una stringa");
                }
                if (nome.length > 50) {
                    throw new Error("Città deve essere al massimo di 50 caratteri");
                }
            }
            return true;  
        })
        .escape(), 
    body("cap")
        /* .optional()
        .isArray({ min: 1 })
        //.isString()
        .trim()
        .matches(/^\d{5}$/).withMessage("Il campo deve contenere esattamente 5 cifre")
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        //.isLength({ max: 5 }).withMessage("CAP deve essere max 5 numeri")
        .escape(),  */
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value: string[]) => 
            value.map((item) => item.trim()) 
        )
        .custom((value: string[]) => {
            if (value.length > 0) {
                const cap = value[0];  
                if (cap === '') return true;
                const regex = /^\d{5}$/;
                if (!regex.test(cap)) {
                    throw new Error("Il campo deve contenere esattamente 5 cifre");
                }
            }
            return true;  
        })
        .escape(),
    body("provincia")
        /* .optional()
        .isArray({ min: 1 })
        //.isString()
        .trim()
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ max: 3 }).withMessage("Provincia deve essere max 3 caratteri")
        .escape(),  */
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
        .custom((value:string[]) => {
            if (value.length > 0) {
                const nome = value[0]; 
                if (typeof nome !== "string") {
                    throw new Error("Il campo deve essere una stringa");
                }
                if (nome.length > 3) {
                    throw new Error("Provincia deve essere al massimo di 3 caratteri");
                }
            }
            return true;  
        })
        .escape(), 
    body("telefono")
        /* .optional()
        .isArray({ min: 1 })
        //.isString()
        .trim()
        .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo telefono non è valido")
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        //.isLength({ max: 15 }).withMessage("Telefono deve essere max 15 caratteri separatore incluso")
        .escape(),  */
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value: string[]) => 
            value.map((item) => item.trim()) 
        )
        .custom((value: string[]) => {
            if (value.length > 0) {
                const telefono = value[0]; 
                if (telefono === '') return true; 
                const regex = /^\d{1,3}(\/?\d{1,11})?$/;
                if (!regex.test(telefono)) {
                    throw new Error("Telefono deve essere max 15 caratteri separatore incluso");
                }
            }
            return true;  
        })
        .escape(),
    body("cellulare")
        /* .optional()
        .isArray({ min: 1 })
        //.isString()
        .trim()
        .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo cellulare non è valido")
        //.notEmpty().withMessage('Il campo non può essere vuoto')
        //.isLength({ max: 15 }).withMessage("Cellulare deve essere max 15 caratteri separatore incluso")
        .escape(), */ 
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value: string[]) => 
            value.map((item) => item.trim()) 
        )
        .custom((value: string[]) => {
            if (value.length > 0) {
                const telefono = value[0]; 
                if (telefono === '') return true; 
                const regex = /^\d{1,3}(\/?\d{1,11})?$/;
                if (!regex.test(telefono)) {
                    throw new Error("Cellulare deve essere max 15 caratteri separatore incluso");
                }
            }
            return true;  
        })
        .escape(),
]



