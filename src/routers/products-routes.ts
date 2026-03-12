import { Router } from "express";
import { ProductsController } from "../controllers/products-controller";

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get("/", productsController.index);

export { productsRouter };