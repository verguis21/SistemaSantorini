import {Request, Response} from "express";

import {
getAccountCheckout,
payAccount
} from "./checkout.service";

export const checkoutDetail = async(
req:Request,
res:Response
)=>{

try{

const result = await getAccountCheckout(
Number(req.params.id)
);

res.json(result);

}catch(error:any){

res.status(400).json({

message:error.message

});
}
};

export const processPayment = async (
    req: Request,
    res: Response
) => {

    try {

        const accountId = Number(req.body.accountId);

        const method = String(req.body.method);


        if (!Number.isInteger(accountId) || accountId <= 0) {

            return res.status(400).json({
                message: "accountId no válido"
            });

        }


        if (!method) {

            return res.status(400).json({
                message: "Debe indicar un método de pago"
            });

        }


        const result = await payAccount(
            accountId,
            method
        );


        res.json(result);


    } catch (error: any) {

        res.status(400).json({

            message: error.message

        });

    }

};