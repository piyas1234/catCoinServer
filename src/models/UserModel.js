const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: [true, "Name is Required!"],
      minlength: 3,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Name is Required!"],
      minlength: 3,
      trim: true,
    },
    username: {
      type: String,
      unique: [true, "Username is Already Registered!"],
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "merchant", "user"],
    },
    coins: {
      type: Number, // Changed to Number for numerical operations
      default: 1000,
    },
    dailySpin: {
      type: Number, // Changed to Number for numerical operations
      default: 7,
    },
    refers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
