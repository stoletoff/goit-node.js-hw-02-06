import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { HttpError } from "../helpers/index.js";
import { cntrlWrapper } from "../decorators/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
dotenv.config();

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarUrl = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    user: {
      avatarUrl,
      email: newUser.email,
      name: newUser.name,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(201).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name, subscription } = req.user;
  res.status(200).json({
    name,
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "Logout success",
  });
};

const updAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath)
    .then((avatar) => {
      return avatar.resize(250, 250);
    })
    .catch((err) => {
      throw err;
    });

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarPath, filename);
  await fs.rename(oldPath, resultUpload);
  const avatarUrl = path.resolve("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarUrl });
  res.status(200).json({ avatarUrl });
};

export default {
  register: cntrlWrapper(register),
  login: cntrlWrapper(login),
  getCurrent: cntrlWrapper(getCurrent),
  logout: cntrlWrapper(logout),
  updAvatar: cntrlWrapper(updAvatar),
};
