import {Router} from "express";

import {

listKitchenOrders,

changeOrderStatus

} from "./kitchen.controller";

const router = Router();

router.get(
"/",
listKitchenOrders
);

router.patch(
"/:id/status",
changeOrderStatus
);

export default router;