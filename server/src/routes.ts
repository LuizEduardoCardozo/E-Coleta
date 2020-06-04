import Router from 'express'

const router = Router();

router.get('/', (req,res) => res.json({message: "Olá, mundo!"}))

export default router;
