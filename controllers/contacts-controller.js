import { HttpError } from "../helpers/index.js";
// import contactsAddSchema from "../SchemaValidation/contactsAddSchema.js";
import Contact from "../models/contact.js";
import { cntrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

// const getById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.getContactById(contactId);
//   if (!result) {
//     throw HttpError(
//       404,
//       `Contact with id=${contactId} not found, please try again later`
//     );
//   }
//   res.json(result);
// };

const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

// const updateById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.updateContactByID(contactId, req.body);
//   if (!result) {
//     throw HttpError(
//       404,
//       `Contact with id=${contactId} not found, please try again later`
//     );
//   }
//   res.json(result);
// };

// const deleteById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.removeContact(contactId);
//   if (!result) {
//     throw HttpError(
//       404,
//       `Contact with id=${contactId} not found, please try again later`
//     );
//   }
//   res.json({
//     message: "Contact with id=${contactId}, has been deleted",
//   });
// };

export default {
  getAll: cntrlWrapper(getAll),
  // getById: cntrlWrapper(getById),
  add: cntrlWrapper(add),
  // updateById: cntrlWrapper(updateById),
  // deleteById: cntrlWrapper(deleteById),
};
