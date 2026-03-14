import { NextFunction, Request, Response  } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
// import { AppError } from "@/errors/AppError";

class TablesController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const tables = await knex<TableRepository>("tables").select("*").orderBy("number", "asc");
            return res.status(200).json({
                message: `Foram encontrados ${tables.length} Mesas.`,
                data: tables
            });
        } catch (error) {
            next(error);
        }
    }
}

export { TablesController }