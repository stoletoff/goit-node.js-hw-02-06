import Joi from "joi";
const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().min(10).max(13).required(),
  favorite: Joi.boolean().messages({ message: "missing fields favorite" })
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export default { contactsAddSchema, contactUpdateFavoriteSchema };
