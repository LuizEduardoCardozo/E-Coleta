import Router from 'express'

const router = Router();

router.get('/itens', (req,res) => res.json({message: "Olá, mundo!"}))


export default router;
