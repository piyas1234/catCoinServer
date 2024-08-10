const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

dotenv.config();

const LoginUserView = async (req, res) => {
  try {
    // Extract data from request body
    const { username, id, first_name, last_name, referredBy } = req.body;

    // Validate that `id` is treated correctly based on your schema
    const userId = id; // Since user_id is a string in your schema, we don't need to convert it.

    // Find the user by username and user_id
    let user = await UserModel.findOne({ username, user_id: userId }).populate("refers");

    if (!user) {
      // Create a new user if not found
      user = new UserModel({
        user_id: userId,
        first_name,
        last_name,
        username,
        role: "user", // Default role
        coins: 0 // Initialize coins
      });

      // Save the new user to the database
      await user.save();
    }

    // If the user was referred by someone, add the new user's ID to the refers array of the referring user
    if (referredBy) {
      // Convert referredBy to ObjectId if it’s in string format and check if it's valid
      let referrerId;
      try {
        referrerId = new mongoose.Types.ObjectId(referredBy);
      } catch (e) {
        console.error("Invalid ObjectId format for referredBy");
        return res.status(400).send({ message: "Invalid referral ID." });
      }

      const referrer = await UserModel.findById(referrerId);

      if (referrer) {
        // Check if the referrer has not already referred the user
        if (!referrer.refers.includes(user._id)) {
          referrer.refers.push(user._id);
          referrer.coins += 10000; // Add coins to the referrer
          await referrer.save();
        }

        // Add coins to the new user
        user.coins += 10000;
        await user.save();
      }
    }

    // Create a token with the user's ID, name, and role
    const token = jwt.sign(
      { id: user._id, name: user.first_name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // expires in 1 day
      }
    );

    // Send the response with user information and token
    res.status(200).send({
      message: `${user.first_name} logged in successfully!`,
      auth: true,
      token,
      role: user.role,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred during login.", error });
  }
};

module.exports = {
  LoginUserView,
};
