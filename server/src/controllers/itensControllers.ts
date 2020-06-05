import {Request, Response} from 'express';
import knex from '../database/connection';

class itensControllers {
    async index( req: Request, res: Response ) {

        const itens = await knex('itens').select('*');

        const serializedItens = itens.map(item => {
            return {
                id:item.id, 
                nome:item.title,
                image_url:`http://localhost:3000/uploads/${item.image}`
            };
        });

        return res.json(serializedItens);
    }
}

export default itensControllers;
