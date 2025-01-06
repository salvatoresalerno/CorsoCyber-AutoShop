

import { body, param } from "express-validator";

export const usernameValidator = [
    param("username")
        .trim()
        .notEmpty().withMessage('Il campo non può essere vuoto')
        .isLength({ min: 3, max: 30 }).withMessage("Username deve essere da 3 a 30 caratteri")
        .escape(),    
  ];



  



