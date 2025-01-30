
import { Router } from "express";
import { logOutValidator, signInValidator, signUpValidator, updAdminValidator } from "../validators/auth.schema";
import { getAuth, getCurrentUser, logout, refresh, signInUser, signUp, updAdmin } from "../controller/auth.controller";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { validateRecaptcha } from "../middleware/validateRecaptcha";


const router: Router = Router();

router.post('/signup', signUpValidator, validateReq, signUp );
router.put('/updAdmin', authenticate, updAdminValidator, validateReq, updAdmin );


router.post('/signin', validateRecaptcha, signInValidator, validateReq, signInUser);

router.post('/getCurrentUser', authenticate, getCurrentUser);

router.post('/refresh', refresh);  

router.post('/getAuth', authenticate, getAuth);

//router.post('/securityLogout', securityLogout);


router.post('/logout', logOutValidator, validateReq, logout);




export default router;