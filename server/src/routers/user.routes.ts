
import { Router } from "express";
import { profiloValidator, profiloValidator2, usernameValidator } from "../validators/user.schema";
import { validateReq } from "../middleware/validateRequest";
import { getProfilo, getProfiloImage, setProfilo, setProfilo2 } from "../controller/user.controller";
import { authenticate } from "../middleware/authenticate";
import { parseFormData } from "../middleware/parseFormData";




const router: Router = Router();



router.get('/getProfilo/:username', authenticate, usernameValidator, validateReq,  getProfilo);
router.put('/setProfilo', authenticate, profiloValidator, validateReq, setProfilo);

router.put('/updProfilo', authenticate, parseFormData('avatar'), profiloValidator2,   validateReq,  setProfilo2);

router.get('/getProfileImage/:username', authenticate, usernameValidator, validateReq,  getProfiloImage);

export default router;