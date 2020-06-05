import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {

    async create( req: Request, res: Response ) {
        const {nome,email,whatsapp,latitude,longitude,uf,city,itens} = req.body;

        const point = {
            imagem:"image-fake",
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            uf,
            city
        }

        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert(point);
        const point_id = insertedIds[0];

        const pointItens =  itens.map((iten_id:number) => { 
            return { 
                iten_id, 
                point_id
            };
        });

        await trx('point_itens').insert(pointItens);

        return res.json({id: point_id,...point});
    }

    async show( req: Request, res: Response) {
        
        const { id } = req.params;
        const point = await knex('points').where('id',id).first();
                
        if(!point){
            res.send(400).json({error:"Point not found!"});
        }

        return res.json(point);

    }

}



export default PointsController;
