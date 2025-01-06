
import { Router } from "express";
import { usernameValidator } from "../validators/user.schema";
import { validateReq } from "../middleware/validateRequest";
import { getProfilo } from "../controller/user.controller";
import { authenticate } from "../middleware/authenticate";




const router: Router = Router();


//router.get('/getVeicoliStato/:stato', statoVeicoliValidator, validateReq,  getVeicoliStato);


router.get('/getProfilo/:username', authenticate, usernameValidator, validateReq,  getProfilo);



export default router;