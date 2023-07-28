import { HttpError } from "../helpers/index.js";
const validateBody = (contactsAddSchema) => {
  const func = (req, res, next) => {
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
