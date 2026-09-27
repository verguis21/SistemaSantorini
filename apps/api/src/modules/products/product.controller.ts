import { Request, Response } from "express";
import {
    getProducts,
    createProduct
} from "./product.service";



export const listProducts = async(
    req:Request,
    res:Response
)=>{

    try{

        const products = await getProducts();

        res.json(products);

    }catch(error){
        console.error(error);

        res.status(500).json({
            message:"Error obteniendo pedidos",
            error
        });
        }

};




export const addProduct = async(
    req:Request,
    res:Response
)=>{

    try{

        const product = await createProduct(req.body);

        res.status(201).json(product);


    }catch(error){

        res.status(500).json({
            message:"Error creando producto"
        });

    }

};