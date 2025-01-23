import { Router } from "express";
import { sendInfo, sendOrder } from "../controller/mail.controller";
import { infoValidator, orderValidator } from "../validators/mail.schema";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";




const router: Router = Router();




router.post('/sendInfo', infoValidator, validateReq, sendInfo);

router.post('/sendOrder', authenticate, orderValidator, validateReq, sendOrder);





export default router;