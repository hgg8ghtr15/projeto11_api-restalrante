import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";

class TablesSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number().min(1, "ID da Mesa é requerido!"),
      });
      const { table_id } = bodySchema.parse(req.body);

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .select("*")
        .where({ table_id, closed_at: null })
        .orderBy("opened_at", "desc")
        .first();

      if (session) {
        return res.status(200).json({
          message: `A Mesa ${table_id} já tem uma sessão aberta.`,
          data: session,
        });
      }

      const tableSession = await knex<TablesSessionsRepository>(
        "tables_sessions",
      ).insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      return res.status(201).json({
        message: "Sessão de Mesa Criada",
        data: { tableSession },
      });
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await knex<TablesSessionsRepository>("tables_sessions")
        .select("*")
        .where({ closed_at: null })
        .orderBy("opened_at", "desc");

      return res.status(200).json({
        message: `Foram encontrados ${sessions.length} sessões de mesas abertas.`,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  }

  async upadate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .trim()
        .min(1, "ID é requerido!")
        .transform((value) => parseInt(value, 10))
        .refine((value) => !isNaN(value), "ID deve ser um número válido!")
        .parse(req.params.id);

      const sessionExiste = await knex<TablesSessionsRepository>("tables_sessions")
        .select("*")
        .where({ id, closed_at: null })
        .orderBy("opened_at", "desc")
        .first();

      if (!sessionExiste) {
        return res.status(200).json({
          message: `A Mesa ${id} não tem uma sessão aberta.`,
          data: sessionExiste,
        });
      }

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .update({ closed_at: knex.fn.now() })
        .where({ id });

      return res.status(200).json({
        message: `Sessão de Mesa ${id} foi fechada.`,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };
