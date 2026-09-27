import {Request, Response} from "express";

import {
    getOrders,
    createOrder,
    updateOrderStatus
} from "./order.service";

export const listOrders = async(
req:Request,
res:Response
)=>{

    try{

        const orders = await getOrders();

        res.json(orders);

    }catch(error){
        console.error(error);

        res.status(500).json({
            message:"Error obteniendo pedidos",
            error
        });
        }
};

export const addOrder = async(
req:Request,
res:Response
)=>{
    try{
        const order = await createOrder(
            req.body
        );
        res.status(201).json(order);

    }catch(error:any){

        res.status(400).json({

            message:error.message
        });
    }
};
export const changeOrderStatus = async(
    req:Request,
    res:Response
)=>{

    try{

        const orderId = Number(req.params.id);

        const {status} = req.body;


        const order = await updateOrderStatus(
            orderId,
            status
        );


        res.json(order);


    }catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};