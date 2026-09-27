import  prisma from "../../config/prisma";

export const getAccounts = async () => {

    return await prisma.tableAccount.findMany({

        where:{
            status:{
                 in:[
                    "OPEN",
                    "IN_PROCESS",
                    "READY"
                    ]
                    }
        },

        include:{
            table:true,
            orders:true
        }

    });

};

export const createAccount = async (
    tableId:number
)=>{
    return await prisma.$transaction(async(tx)=>{

        // 1. Buscar mesa
        const table = await tx.diningTable.findUnique({

            where:{
                id:tableId
            }

        });

        if(!table){

            throw new Error("Mesa no encontrada");

        }

        if(table.status === "OCCUPIED"){

            throw new Error("La mesa ya está ocupada");

        }

        // 2. Crear cuenta
        const account = await tx.tableAccount.create({

            data:{
                tableId
            }

        });

        // 3. Cambiar estado mesa
        await tx.diningTable.update({

            where:{
                id:tableId
            },

            data:{
                status:"OCCUPIED"
            }

        });

        return account;
    });

};
export const getAccountByIdService = async(id:number)=>{

    return await prisma.tableAccount.findUnique({

        where:{
            id
        },

        include:{
            table:true,

            orders:{
                include:{
                    items:{
                        include:{
                            product:true
                        }
                    }
                }
            }
        }

    });

};
export const getAccountByTableService = async(
tableId:number
)=>{


const account = await prisma.tableAccount.findFirst({

where:{

tableId,

status:{
in:[
"OPEN",
"IN_PROCESS",
"READY"
]
}

},

include:{
table:true,

orders:{
include:{
items:{
include:{
product:true
}
}
}
}

}

});


if(!account){

throw new Error(
"No existe una cuenta activa para esta mesa"
);

}


return account;

};