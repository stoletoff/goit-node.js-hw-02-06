import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";
import { cntrlWrapper } from "../decorators/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
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

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail({ email, verificationToken });

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      avatarUrl,
      email: newUser.email,
      name: newUser.name,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Verify success" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verify");
  }
  const verifyEmail = createVerifyEmail({
    email,
    verificationToken: user.verificationToken,
  });
  await sendEmail(verifyEmail);
  res.json({
    message: "Resend email success",
  });
};
export default {
  register: cntrlWrapper(register),
  verify: cntrlWrapper(verify),
  login: cntrlWrapper(login),
  getCurrent: cntrlWrapper(getCurrent),
  logout: cntrlWrapper(logout),
  updAvatar: cntrlWrapper(updAvatar),
  resendVerifyEmail: cntrlWrapper(resendVerifyEmail),
};
