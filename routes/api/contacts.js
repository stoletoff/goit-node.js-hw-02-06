import express from "express";
import contactsService from "../../models/contacts.js";
import { HttpError } from "../../helpers/index.js";
import contactsAddSchema from "../../SchemaValidation/contactsAddSchema.js";

const contactsRouter = express.Router();

contactsRouter.get("/", async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      throw HttpError(
        404,
        `Contact with id=${contactId} not found, please try again later`
      );
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post("/", async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contactsService.updateContactByID(contactId, req.body);
    if (!result) {
      throw HttpError(
        404,
        `Contact with id=${contactId} not found, please try again later`
      );
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
      throw HttpError(
        404,
        `Contact with id=${contactId} not found, please try again later`
      );
    }
    res.json({
      message: "Contact with id=${contactId}, has been deleted",
    });
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
