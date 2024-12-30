
import { Router } from "express";
import { uploadImage } from "../controller/image.controller";
import { addVeicoloValidator } from "../validators/veicolo.schema";
import { validateReq } from "../middleware/validateRequest";
import { parseFormData } from "../middleware/parseFormData";


const router: Router = Router();


 


router.post('/upload', parseFormData, addVeicoloValidator,   validateReq,  uploadImage);







export default router;