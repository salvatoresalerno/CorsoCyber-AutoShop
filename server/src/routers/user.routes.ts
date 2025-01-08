
import { Router } from "express";
import { profiloValidator, usernameValidator } from "../validators/user.schema";
import { validateReq } from "../middleware/validateRequest";
import { getProfilo, setProfilo } from "../controller/user.controller";
import { authenticate } from "../middleware/authenticate";




const router: Router = Router();



router.get('/getProfilo/:username', authenticate, usernameValidator, validateReq,  getProfilo);
router.put('/setProfilo', authenticate, profiloValidator, validateReq, setProfilo);



export default router;