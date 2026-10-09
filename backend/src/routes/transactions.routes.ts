import { Router } from "express";
import * as transactionsController from "../controllers/transactions.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { csvUpload } from "../middleware/upload.middleware";
import { validateBody, validateQuery } from "../middleware/validate.middleware";
import { transactionQuerySchema, transactionUpdateSchema } from "../validators/transaction.validators";

export const transactionsRouter = Router();
transactionsRouter.use(requireAuth);

transactionsRouter.post("/upload", csvUpload, transactionsController.upload);
transactionsRouter.get("/export", transactionsController.exportMonth);
transactionsRouter.get("/", validateQuery(transactionQuerySchema), transactionsController.list);
transactionsRouter.patch("/:id", validateBody(transactionUpdateSchema), transactionsController.updateCategory);
transactionsRouter.delete("/:id", transactionsController.remove);
