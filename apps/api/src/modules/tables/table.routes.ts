import {Router} from "express";


import {
listTables,
addTables
} from "./table.controller";


const router = Router();


router.get(
"/",
listTables
);


router.post(
"/seed",
addTables
);


export default router;