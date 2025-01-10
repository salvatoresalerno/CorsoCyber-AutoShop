
import { Router } from "express";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { usernameValidator } from "../validators/user.schema";
import { getUsers } from "../controller/admin.controller";


const router: Router = Router();



router.get('/getUsers', authenticate,  getUsers);




export default router;