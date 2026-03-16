import { Router } from "express";

import { productsRouter } from "./products-routes";
import { tablesRouter } from "./tables-router";
import { tablesSessions } from "./tables-sessions-routes";
import { ordersRouter } from "./orders-routes";

const router = Router();
router.use("/products", productsRouter);
router.use("/tables", tablesRouter);
router.use("/tables-sessions", tablesSessions);
router.use("/orders", ordersRouter);

export { router };