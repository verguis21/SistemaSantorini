import {Router} from "express";

import {
    listAccounts,
    openAccount,
    getAccountById,
    getAccountByTable
} from "./account.controller";

const router = Router();

router.get(
    "/",
    listAccounts
);


router.get(
    "/:id",
    getAccountById
);


router.post(
    "/",
    openAccount
);

router.get(
    "/table/:tableId",
    getAccountByTable
);

export default router;