import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {

    async index( req: Request, res: Response ) {
        // cidade, uf, itens 

        const {city, uf, itens} = req.query;

        const parsedItens = String(itens)
                .split(",")
                .map(item => Number(item.trim()));


        const points = await knex('points').join('point_itens', 'points.id', '=', 'point_itens.point_id')
            .whereIn('point_itens.point_id', parsedItens)
            .where('city', String(city)).where('uf', String(uf))
            .distinct().select('points.*');
            
        console.log(points)

        return res.json({points});

    }

    async create( req: Request, res: Response ) {
        const {nome,email,whatsapp,latitude,longitude,uf,city,itens} = req.body;

        const point = {
            imagem:"https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
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

        await trx.commit();

        return res.json({id: point_id,...point});
    }

    async show( req: Request, res: Response) {
        
        const { id } = req.params;
        const point = await knex('points').where('id',id).first()
        
        if(!point){
            res.send(400).json({error:"Point not found!"});
        }

        const itens = await knex('itens')
            .join('point_itens','itens.id','=','point_itens.iten_id')
            .where('point_itens.point_id',id).select('itens.title');
            

        console.log(itens);

        return res.json({ point, itens });

    }

}



export default PointsController;
