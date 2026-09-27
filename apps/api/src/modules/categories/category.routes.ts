import { Router } from "express";


import {
    listCategories,
    addCategory
} from "./category.controller";


const router = Router();



router.get(
    "/",
    listCategories
);



router.post(
    "/",
    addCategory
);



export default router;