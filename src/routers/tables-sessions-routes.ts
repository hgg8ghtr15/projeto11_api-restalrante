import { Router } from "express";
import { TablesSessionsController } from "../controllers/tables-sessions-controller";

const tablesSessions = Router();
const tablesSessionsController = new TablesSessionsController();

tablesSessions.post("/", tablesSessionsController.create)
tablesSessions.get("/", tablesSessionsController.index)
tablesSessions.put("/:id", tablesSessionsController.upadate)

export { tablesSessions };