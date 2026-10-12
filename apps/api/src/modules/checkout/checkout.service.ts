import prisma from "../../config/prisma";


const PAYMENT_METHODS = [
    "EFECTIVO",
    "TARJETA",
    "YAPE",
    "PLIN"
] as const;


type PaymentMethod = typeof PAYMENT_METHODS[number];

// Obtener detalle para caja
export const getAccountCheckout = async (accountId: number) => {

    const account = await prisma.tableAccount.findFirst({

        where: {
            id: accountId,

            status:{
                in:[
                    "OPEN",
                    "IN_PROCESS",
                    "READY"
                ]
            }
        },


        include: {

            table: true,


            orders: {

                include: {

                    items: {

                        include: {

                            product: true

                        }

                    }

                }

            }

        }

    });

    if (!account) {

        throw new Error(
            "Cuenta no encontrada o ya está cerrada"
        );

    }
        const pendingOrders = account.orders.filter(
        order =>
            !["READY", "DELIVERED"].includes(order.status)
    );

    if (pendingOrders.length > 0) {
        throw new Error(
            "No se puede cobrar: hay comandas pendientes de preparación o entrega."
        );
    }

    let total = 0;

    account.orders.forEach(order => {


        order.items.forEach(item => {


            total += Number(item.price) * item.quantity;


        });


    });

    return {

        accountId: account.id,

        mesa: account.table.number,

        total,

        orders: account.orders

    };

};

// Procesar pago
export const payAccount = async (

    accountId:number,

    method:string

)=>{


    if(
        !PAYMENT_METHODS.includes(
            method as PaymentMethod
        )
    ){

        throw new Error(
            "Método de pago no válido"
        );

    }

    return await prisma.$transaction(async(tx)=>{


        const account = await tx.tableAccount.findUnique({


            where:{
                id:accountId
            },


            include:{


                orders:{


                    include:{


                        items:true

                    }

                }

            }

        });

        if(!account){

            throw new Error(
                "Cuenta no encontrada"
            );

        }


        // Validar estados permitidos para cobrar
        const validStatuses = [
            "OPEN",
            "IN_PROCESS",
            "READY"
        ];

        if(
            !validStatuses.includes(
                account.status
            )
        ){

            throw new Error(
                "Esta cuenta ya fue cerrada y no puede cobrarse nuevamente"
            );

        }

        let total = 0;

        account.orders.forEach(order=>{


            order.items.forEach(item=>{


                total += Number(item.price) * item.quantity;


            });


        });

        if(total <= 0){

            throw new Error(
                "No se puede cobrar una cuenta sin consumo"
            );

        }

        // Crear venta

        const sale = await tx.sale.create({

            data:{

                accountId,

                total

            }

        });

        // Crear pago

        await tx.payment.create({

            data:{

                saleId:sale.id,

                method:method as PaymentMethod,

                amount:total

            }

        });

        // Cerrar cuenta

        await tx.tableAccount.update({

            where:{
                id:accountId
            },


            data:{

                status:"CLOSED"

            }

        });


      // Liberar mesa

        await tx.diningTable.update({

            where:{

                id:account.tableId

            },


            data:{

                status:"FREE"

            }

        });

        return sale;
    });

};