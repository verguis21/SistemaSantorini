import { Request, Response } from "express";

import {
    getCategories,
    createCategory
} from "./category.service";



export const listCategories = async(
    req:Request,
    res:Response
)=>{

    try{

        const categories = await getCategories();

        res.json(categories);

    }catch(error){

        res.status(500).json({
            message:"Error obteniendo categorías"
        });

    }

};




export const addCategory = async(
    req:Request,
    res:Response
)=>{

    try{

        const category = await createCategory(req.body);

        res.status(201).json(category);


    }catch(error){

        res.status(500).json({
            message:"Error creando categoría"
        });

    }

};