import {Request, Response} from "express";

import {
    getKitchenOrders,
    updateOrderStatus
} from "./kitchen.service";

export const listKitchenOrders = async(
req:Request,
res:Response
)=>{

try{

const orders = await getKitchenOrders();

res.json(orders);

}catch(error){

res.status(500).json({

message:"Error obteniendo pedidos de cocina"

});
}
};

export const changeOrderStatus = async(
req:Request,
res:Response
)=>{

try{

const {id}=req.params;

const {status}=req.body;

const order = await updateOrderStatus(

Number(id),

status

);

res.json(order);

}catch(error){

res.status(400).json({

message:"Error actualizando estado"
});
}
};