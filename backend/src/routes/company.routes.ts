import { Router } from 'express';
import { companyController } from '../controllers/company.controller';

const router = Router();

router.get('/', companyController.getAll);
router.get('/:id', companyController.getById);
router.post('/', companyController.create);
router.put('/:id', companyController.update);
router.delete('/:id', companyController.delete);

export default router;
