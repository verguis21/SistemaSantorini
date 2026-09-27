import prisma  from "../../config/prisma";

export const getKitchenOrders = async()=>{

    return await prisma.order.findMany({

        where:{
            status:{
                in:[
                    "SENT_TO_KITCHEN",
                    "PREPARING",
                    "READY"
                ]
            }
        },

        include:{
            account:{
                include:{
                    table:true
                }
            },

            items:{
                include:{
                    product:true
                }
            },

            user:true
        },

        orderBy:{
            createdAt:"asc"
        }
    });

};

export const updateOrderStatus = async(
    orderId:number,
    status:any
)=>{

    return await prisma.order.update({

        where:{
            id:orderId
        },

        data:{
            status
        }
    });
};