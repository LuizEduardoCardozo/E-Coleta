import Router, { response } from 'express'

import pointsControllers from './controllers/pointsControllers';
import itensControllers from './controllers/itensControllers';

const router = Router();
const PointsController = new pointsControllers;
const ItensControllers = new itensControllers;

router.get('/itens', ItensControllers.index);

router.get('/points/', PointsController.index);
router.get('/points/:id', PointsController.show);
router.post('/points', PointsController.create);

export default router;
