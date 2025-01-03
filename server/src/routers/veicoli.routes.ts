
import { Router } from "express";
import { getBrand, getBrandAndModel, getFilteredVeicoli, getVeicoliStato, addVeicolo } from "../controller/veicoli.controller";
import { addVeicoloValidator, filteredVeicoliValidator, statoVeicoliValidator } from "../validators/veicolo.schema";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { parseFormData } from "../middleware/parseFormData";


const router: Router = Router();


router.get('/getVeicoliStato/:stato', statoVeicoliValidator, validateReq,  getVeicoliStato);
//router.get('/getVeicoliVenduti',  getVeicoliVenduti);


router.post('/getFilteredVeicoli', filteredVeicoliValidator, validateReq, getFilteredVeicoli);

 
router.get('/brand', authenticate, getBrand);
router.get('/brand_model', authenticate, getBrandAndModel);

router.post('/addVeicolo', parseFormData, addVeicoloValidator,   validateReq,  addVeicolo);







export default router;