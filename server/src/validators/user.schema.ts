

import { body, param } from "express-validator";

export const usernameValidator = [
    param("username")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Username deve contenere solo lettere e numeri")
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
        .isLength({ max: 50 }).withMessage("Nome deve essere max 50 caratteri")
        .escape(), 
    body("cognome")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 }).withMessage("Cognome deve essere max 50 caratteri")
        .escape(), 
    body("via")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 }).withMessage("Via deve essere max 100 caratteri")
        .escape(), 
    body("citta")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 }).withMessage("Città deve essere max 50 caratteri")
        .escape(), 
    body("cap")
        .optional()
        .isString()
        .trim()
        .matches(/^\d{5}$/).withMessage("Il campo deve contenere esattamente 5 cifre")
        .escape(), 
    body("provincia")
        //.optional()
        .isString()
        .trim()
        .isLength({min: 0, max: 3 }).withMessage("Provincia deve essere tra 2 e 3 caratteri")
        .matches(/^[A-Za-z]+$/).withMessage('Provincia deve contenere solo lettere.')
        .escape(), 
    body("telefono")
        .optional()
        .isString()
        .trim()
        .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo telefono non è valido")
        .escape(), 
    body("cellulare")
        .optional()
        .isString()
        .trim()
        .matches(/^\d{1,3}(\/?\d{1,11})?$/).withMessage("Il campo cellulare non è valido")
        .escape(), 
]
export const profiloValidator2 = [   
    body("id")   
        .isArray({ max: 1 })
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
    body("cognome")        
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
        .optional()
        .isArray({ max: 1 })
        .withMessage("massimo 1 elemento")
        .customSanitizer((value:string[]) => value.map((item: string) => item.trim()))  
        .custom((value:string[]) => {
            if (value.length > 0) {
                const provincia = value[0]; 
                if (typeof provincia !== "string") {
                    throw new Error("Il campo deve essere una stringa");
                }
                if (provincia === '') return true;
                const regex = /^[A-Za-z]{2,3}$/
                /* if (provincia.length < 2 || provincia.length > 3) {
                    throw new Error("Provincia deve essere al tra 2 e 3 caratteri");
                } 
                const regex = /^[A-Za-z]+$/;*/
                if (!regex.test(provincia)) {
                    throw new Error("Provincia può contenere solo lettere 2/3");
                }
            }
            return true;  
        })
        .escape(), 
    body("telefono")
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
    body('avatar')   
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
                  throw new Error("avatar non può essere vuoto");
              }
          }
          return true;  
        })
        .escape(),
]



