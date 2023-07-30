import { Schema, model } from "mongoose";
import { handleSaveError, validateAtUpdate } from "./hooks.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlenth: 6,

      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
