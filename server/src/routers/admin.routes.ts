
import { Router } from "express";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { bannedValidatorBody } from "../validators/user.schema";
import { getUsers, setBanned } from "../controller/admin.controller";


const router: Router = Router();



router.get('/getUsers', authenticate,  getUsers);

router.put('/setBanned', authenticate, bannedValidatorBody, validateReq, setBanned);




export default router;