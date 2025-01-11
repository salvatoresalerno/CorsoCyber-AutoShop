
import { Router } from "express";
import { getBrand, getBrandAndModel, getFilteredVeicoli, getVeicoliStato, addVeicolo, getVeicoloByID, setVenduto, deleteVeicoloByID } from "../controller/veicoli.controller";
import { addVeicoloValidator, filteredVeicoliValidator, getVeicoloValidator, idValidatorBody, statoVeicoliValidator } from "../validators/veicolo.schema";
import { validateReq } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authenticate";
import { parseFormData } from "../middleware/parseFormData";


const router: Router = Router();


router.get('/getVeicoliStato/:stato', statoVeicoliValidator, validateReq,  getVeicoliStato);


router.post('/getFilteredVeicoli', filteredVeicoliValidator, validateReq, getFilteredVeicoli);

 
router.get('/brand', authenticate, getBrand);
router.get('/brand_model', authenticate, getBrandAndModel);

router.post('/addVeicolo', authenticate, parseFormData('veicoli'), addVeicoloValidator,   validateReq,  addVeicolo);
router.put('/updVeicolo', authenticate, parseFormData('veicoli'), addVeicoloValidator,   validateReq,  addVeicolo);

router.get('/getVeicolo/:id', authenticate, getVeicoloValidator,   validateReq,  getVeicoloByID);

router.put('/setVenduto', authenticate, idValidatorBody,   validateReq,  setVenduto);

router.delete('/deleteVeicolo', authenticate, idValidatorBody,   validateReq,  deleteVeicoloByID);







export default router;