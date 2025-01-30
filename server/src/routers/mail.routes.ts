import { Router } from "express";
import { sendInfo, sendOrder } from "../controller/mail.controller";
import { infoValidator, orderValidator } from "../validators/mail.schema";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { validateRecaptcha } from "../middleware/validateRecaptcha";




const router: Router = Router();




router.post('/sendInfo', validateRecaptcha, infoValidator, validateReq, sendInfo);

router.post('/sendOrder', authenticate, orderValidator, validateReq, sendOrder);





export default router;