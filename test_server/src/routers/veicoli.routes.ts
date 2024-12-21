
import { Router } from "express";
import { getBrand, getBrandAndModel, getFilteredVeicoli, getVeicoliStato } from "../controller/veicoli.controller";
import { filteredVeicoliValidator, statoVeicoliValidator } from "../validators/veicolo.schema";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";


const router: Router = Router();


router.get('/getVeicoliStato/:stato', statoVeicoliValidator,  getVeicoliStato);
//router.get('/getVeicoliVenduti',  getVeicoliVenduti);


router.post('/getFilteredVeicoli', filteredVeicoliValidator, validateReq, getFilteredVeicoli);

 
router.get('/brand', authenticate, getBrand);
router.get('/brand_model', authenticate, getBrandAndModel);







export default router;