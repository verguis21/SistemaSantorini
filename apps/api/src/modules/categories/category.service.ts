import prisma  from "../../config/prisma";


export const getCategories = async () => {

    return await prisma.category.findMany({
        include:{
            products:true
        }
    });

};



export const createCategory = async(
    data:{
        name:string;
    }
)=>{

    return await prisma.category.create({

        data:{
            name:data.name
        }

    });

};