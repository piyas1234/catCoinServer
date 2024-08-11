const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const LoginUserView = async (req, res) => {
  try {
    const {
      username = Math.random(1000000).toString(),
      id,
      first_name,
      last_name,
      referredBy
    } = req.body;

    if (!username || !id || !first_name || !last_name) {
      return res.status(400).send({ message: "Missing required fields." });
    }

    const userId = id; // Assuming user_id is a string in your schema.

    let user = await UserModel.findOne({ username, user_id: userId }).populate(
      "refers"
    );

    if (!user) {
      user = new UserModel({
        user_id: userId,
        first_name,
        last_name,
        username,
        role: "user",
        coins: 0
      });

      await user.save();
    }

    if (referredBy) {
      let referrerId;
      try {
        referrerId = new mongoose.Types.ObjectId(referredBy);
      } catch (e) {
        console.error("Invalid ObjectId format for referredBy");
        return res.status(400).send({ message: "Invalid referral ID." });
      }

      const referrer = await UserModel.findById(referrerId);

      if (referrer && !referrer.refers.includes(user._id)) {
        referrer.refers.push(user._id);
        referrer.coins += 10000;
        await referrer.save();

        user.coins += 10000;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, name: user.first_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      message: `${user.first_name} logged in successfully!`,
      auth: true,
      token,
      role: user.role,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred during login.", error });
  }
};

module.exports = {
  LoginUserView
};
