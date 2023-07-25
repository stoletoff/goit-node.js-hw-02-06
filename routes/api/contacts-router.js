import express from "express";
import contactsController from "../../controllers/contacts-controller.js";

// import { HttpError } from "../../helpers/index.js";
// import contactsAddSchema from "../../SchemaValidation/contactsAddSchema.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", contactsController.getById);

contactsRouter.post("/", contactsController.add);

contactsRouter.put("/:contactId", contactsController.updateById);

contactsRouter.delete("/:contactId", contactsController.deleteById);

export default contactsRouter;
