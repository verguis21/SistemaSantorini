import prisma from "../../config/prisma";


export const getTables = async()=>{

    return await prisma.diningTable.findMany({
        orderBy:{
            number:"asc"
        }
    });

};



export const createTables = async()=>{

    const tables = [];

    for(let i=1;i<=40;i++){

        tables.push({
            number:i
        });

    }


    return await prisma.diningTable.createMany({
        data:tables
    });

};