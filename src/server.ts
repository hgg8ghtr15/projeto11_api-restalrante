import express from "express";
import { router } from "./routers";
import { errorHandling } from "./middlewares/error-handling";

const PORT = 3333;
const app = express();
app.use(express.json());
app.use(router);

app.use(errorHandling)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta. http://localhost:${PORT}`);
});
