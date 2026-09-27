import {Router} from "express";

import {
checkoutDetail,
processPayment
} from "./checkout.controller";

const router = Router();

router.get(
"/:id",
checkoutDetail
);

router.post(
"/pay",
processPayment
);

export default router;