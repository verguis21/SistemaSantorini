import prisma  from "../../config/prisma";

export const getOrders = async()=>{

    return await prisma.order.findMany({

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
            }
        },
        orderBy:{
            createdAt:"desc"
        }
    });
};

export const createOrder = async(data:{
    accountId:number;
    userId:number;
    items:{
        productId:number;
        quantity:number;
    }[];
})=>{

    return await prisma.$transaction(async(tx)=>{

        let orderTotal = 0;

        const orderItems = [];

        for(const item of data.items){

            const product = await tx.product.findUnique({

                where:{
                    id:item.productId
                }
            });

            if(!product){
                throw new Error(
                    "Producto no encontrado"
                );
            }

            orderItems.push({

                productId:item.productId,

                quantity:item.quantity,

                price:product.price
            });

            orderTotal += Number(product.price) * item.quantity;
        }
        

       const order = await tx.order.create({

            data:{

                accountId:data.accountId,

                userId:data.userId,

                status:"SENT_TO_KITCHEN",

                items:{
                    create:orderItems
                }
            },
            include:{
                items:true
            }
        });
        await tx.tableAccount.update({

            where:{
            id:data.accountId
            },

            data:{
            status:"IN_PROCESS"
            }

            });
        return order;
    });
};
export const updateOrderStatus = async (
    orderId:number,
    status:
    "CREATED" |
    "SENT_TO_KITCHEN" |
    "PREPARING" |
    "READY" |
    "DELIVERED"
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