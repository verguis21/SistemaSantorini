import {Request,Response} from "express";

import {
    getTables,
    createTables
} from "./table.service";



export const listTables = async(
req:Request,
res:Response
)=>{

try{

const tables = await getTables();

res.json(tables);


}catch(error){

res.status(500).json({
message:"Error obteniendo mesas"
});

}

};




export const addTables = async(
req:Request,
res:Response
)=>{


try{

const result = await createTables();

res.json(result);


}catch(error){

res.status(500).json({
message:"Error creando mesas"
});

}


};