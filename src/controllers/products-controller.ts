import { AppError } from "@/utils/AppErrorts";
import { NextFunction, Request, Response } from "express";

class ProductsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {

            // throw new AppError("Error fetching products");

            res.json({ message: "Get all products" });
        }catch (error) {
            next(error);
        }
    }
}

export { ProductsController };