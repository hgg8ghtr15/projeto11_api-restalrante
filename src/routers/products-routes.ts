import { Router } from "express";
import { ProductsController } from "../controllers/products-controller";

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get("/", productsController.index);
productsRouter.post("/", productsController.create);
productsRouter.put("/:id", productsController.update);
productsRouter.delete("/:id", productsController.delete);

export { productsRouter };