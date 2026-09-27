import {Router} from "express";

import {
    listOrders,
    addOrder,
    changeOrderStatus
} from "./order.controller";

const router = Router();

router.get(
    "/",
    listOrders
);

router.post(
    "/",
    addOrder
);
router.patch(
    "/:id/status",
    changeOrderStatus
);

export default router;