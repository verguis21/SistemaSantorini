import { Router } from "express";

import {
    listProducts,
    addProduct
} from "./product.controller";

const router = Router();

router.get(
    "/",
    listProducts
);


router.post(
    "/",
    addProduct
);



export default router;