import { AppError } from "@/utils/AppErrorts";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      const products = await knex<ProductRepository>("products")
        .select("*")
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name", "asc");

      res.json({
        message: `Foi encontrados ${products.length} Produtos.`,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6, "Name é requerido!"),
        price: z.number().gt(0, "Price deve ser maior que zero!"),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products").insert({ name, price });

      return res
        .status(201)
        .json({ message: "Produto foi Criado", data: { name, price } });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .trim()
        .min(1, "ID é requerido!")
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), "ID deve ser um número válido!")
        .parse(req.params.id);

      const product = await knex<ProductRepository>("products")
        .select("*")
        .where({ id })
        .first();


      if (!product || undefined) {
        throw new AppError("Produto não encontrado");
      }

      const bodySchema = z.object({
        name: z.string().trim().min(6, "Name é requerido!").optional(),
        price: z.number().gt(0, "Price deve ser maior que zero!").optional(),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products")
        .update({ name, price, updated_at: knex.fn.now() })
        .where({ id });

      return res.json({ message: "Produto atualizado" });
    } catch (error) {
        next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .trim()
        .min(1, "ID é requerido!")
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), "ID deve ser um número válido!")
        .parse(req.params.id);

      const product = await knex<ProductRepository>("products")
        .select("*")
        .where({ id })
        .first();

      if (!product || undefined) {
        throw new AppError("Produto não encontrado");
      }

      await knex<ProductRepository>("products").delete().where({ id });

      return res.json({ message: "Produto deletado" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };
