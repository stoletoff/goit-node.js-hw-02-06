import { HttpError } from "../helpers/index.js";
import Contact from "../models/contact.js";
import { cntrlWrapper } from "../decorators/index.js";
import fs from "fs/promises";
import path from "path";

const avatarPath = path.resolve("public", "avatars");

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(
      404,
      `Contact with id=${id} not found, please try again later`
    );
  }
  res.status(200).json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  console.log(oldPath);
  console.log(newPath);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("public", "avatars", filename);
  const result = await Contact.create({ ...req.body, owner, avatar });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(
      404,
      `Contact with id=${id} not found, please try again later`
    );
  }
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(
      404,
      `Contact with id=${id} not found, please try again later`
    );
  }
  res.status(200).json({
    message: "Contact with id=${id}, has been deleted",
  });
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.status(200).json(result);
};

export default {
  getAll: cntrlWrapper(getAll),
  getById: cntrlWrapper(getById),
  add: cntrlWrapper(add),
  updateById: cntrlWrapper(updateById),
  deleteById: cntrlWrapper(deleteById),
  updateFavorite: cntrlWrapper(updateFavorite),
};
