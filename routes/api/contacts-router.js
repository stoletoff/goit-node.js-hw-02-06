import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import contactsSchema from "../../SchemaValidation/contactsSchema.js";
import {
  upload,
  authenticate,
  isEmptyBody,
  isValidId,
} from "../../middlewars/index.js";
const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.post(
  "/",
  upload.single("avatar"),
  isEmptyBody,
  validateBody(contactsSchema.contactsAddSchema),
  contactsController.add
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(contactsSchema.contactsAddSchema),
  contactsController.updateById
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  validateBody(contactsSchema.contactUpdateFavoriteSchema),
  contactsController.updateFavorite
);
contactsRouter.delete("/:id", isValidId, contactsController.deleteById);

export default contactsRouter;
