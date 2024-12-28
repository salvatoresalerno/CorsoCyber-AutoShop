
import { Router } from "express";
import { uploadImage } from "../controller/image.controller";


const router: Router = Router();


 


router.post('/upload', uploadImage);







export default router;