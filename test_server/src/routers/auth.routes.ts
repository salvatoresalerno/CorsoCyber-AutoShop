
import { Router } from "express";
import { logOutValidator, signInValidator, signUpValidator } from "../validators/auth.schema";
import { getAuth, getCurrentUser, logout, refresh, signInUser, signUp } from "../controller/auth.controller";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";


const router: Router = Router();

router.post('/signup', signUpValidator, validateReq, signUp );
router.post('/signin', signInValidator, validateReq, signInUser);

router.post('/getCurrentUser', authenticate, getCurrentUser);

router.post('/refresh', refresh); //vedere se autenticare route

router.post('/getAuth', authenticate, getAuth)


router.post('/logout', logOutValidator, validateReq, logout);




export default router;