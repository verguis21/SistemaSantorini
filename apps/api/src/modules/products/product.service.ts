import  prisma  from "../../config/prisma";


export const getProducts = async () => {

    return await prisma.product.findMany({
        where:{
            active:true
        },
        include:{
            category:true
        }
    });

};



export const createProduct = async (
    data:{
        name:string;
        price:number;
        categoryId:number;
    }
)=>{

    return await prisma.product.create({

        data:{
            name:data.name,
            price:data.price,
            categoryId:data.categoryId
        }

    });

};