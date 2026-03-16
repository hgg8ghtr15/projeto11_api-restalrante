import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
import { join } from "path";

class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z
          .number()
          .int()
          .positive("table_session_id deve ser um número inteiro positivo!"),
        product_id: z
          .number()
          .int()
          .positive("product_id deve ser um número inteiro positivo!"),
        quantity: z
          .number()
          .int()
          .positive("quantity deve ser um número inteiro positivo!"),
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        req.body,
      );

      //   Verificar se a sessão da mesa existe e está aberta
      const table_session = await knex<TablesSessionsRepository>(
        "tables_sessions",
      )
        .where({ id: table_session_id })
        .first();

      //   verificar se a sessão da mesa existe
      if (!table_session) {
        throw new Error("Sessão da mesa não encontrada");
      }

      //   verificar se a sessão da mesa está aberta
      if (table_session.closed_at) {
        throw new Error(
          "A sessão da mesa está fechada. Não é possível criar um pedido.",
        );
      }
      //   Busco o produto para verificar se existe e obter o preço
      const product = await knex<ProductRepository>("products")
        .where({ id: product_id })
        .first();
      //  verificar se o produto existe
      if (!product) {
        throw new Error("Produto não encontrado");
      }

      const order = await knex<OrderRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price,
      });

      return res.status(201).json({
        message: "Pedido criado com sucesso!",
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const table_session_id = z
        .string()
        .trim()
        .min(1, "ID é requerido!")
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), "ID deve ser um número válido!")
        .parse(req.params.table_session_id);

      const orders = await knex<OrderRepository>("orders")
        .select(
          "orders.id",
          "orders.table_session_id",
          "orders.product_id",
          "orders.quantity",
          "orders.price",
          "products.name",
          // "tables_sessions.table_id",
          "tables.number",
          knex.raw("orders.price * orders.quantity as total_price"),
          "orders.created_at",
          "orders.updated_at",
        )
        .join("products", "products.id", "orders.product_id")
        .join(
          "tables_sessions",
          "tables_sessions.id",
          "orders.table_session_id",
        )
        .join("tables", "tables.id", "tables_sessions.table_id")
        .where({
          table_session_id: table_session_id,
        })
        .orderBy("orders.created_at", "desc");

      return res.json({
        message: "Pedidos listados com sucesso!",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const table_session_id = z
        .string()
        .trim()
        .min(1, "ID é requerido!")
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), "ID deve ser um número válido!")
        .parse(req.params.table_session_id);

      const order = await knex<OrderRepository>("orders")
        .select(
            knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) as total"),
            knex.raw("COALESCE(SUM(orders.quantity), 0) as quantityItens"),
        )
        .where({ table_session_id })
        .first();

      return res.json({
        message: "Valor do peido exibido com sucesso!",
        order
      });
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
