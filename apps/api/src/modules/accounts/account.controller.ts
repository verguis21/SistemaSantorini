import {Request, Response} from "express";

import {
    getAccounts,
    createAccount,
    getAccountByIdService,
    getAccountByTableService
} from "./account.service";

export const listAccounts = async(
req:Request,
res:Response
)=>{

    try{

        const accounts = await getAccounts();

        res.json(accounts);

    }catch(error:any){

    console.error(error);

    res.status(500).json({
        message:error.message
    });

}

};

export const openAccount = async(
req:Request,
res:Response
)=>{

    try{

        const {tableId} = req.body;

        const account = await createAccount(
            Number(tableId)
        );

        res.status(201).json(account);

    }catch(error:any){

        res.status(400).json({
            message:error.message

        });
    }
};

export const getAccountById = async(
req: Request,
res: Response
)=>{

try{

const account = await getAccountByIdService(
    Number(req.params.id)
);

res.json(account);

}catch(error){

res.status(404).json({
    message:"Cuenta no encontrada"
});

}

};
export const getAccountByTable = async(
req:Request,
res:Response
)=>{

try{

const account = await getAccountByTableService(
Number(req.params.tableId)
);


res.json(account);


}catch(error:any){

res.status(404).json({
message:error.message
});

}

};