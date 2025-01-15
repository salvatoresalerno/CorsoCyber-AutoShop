
import { Router } from "express";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { bannedValidatorBody } from "../validators/user.schema";
import { deleteAdmin, getUsers, setBanned } from "../controller/admin.controller";
import { idValidatorBody } from "../validators/veicolo.schema"; 


const router: Router = Router();



router.get('/getUsers', authenticate,  getUsers);

router.put('/setBanned', authenticate, bannedValidatorBody, validateReq, setBanned);

router.delete('/delAdmin', authenticate, idValidatorBody, deleteAdmin)

 




export default router;