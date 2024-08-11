const UserModel = require('../models/UserModel');
const { ObjectId } = require('mongodb');

const followAndEarn = async (req, res) => {
  try {
    const userId = new ObjectId(req.id);

    // Validate the user ID
    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ message: 'Invalid user ID.' });
    }

    // Fetch the user
    const user = await UserModel.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Validate the coins
    const coinsToAdd = parseInt(req.body.coins, 10);
    if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
      return res.status(400).send({ message: 'Invalid coins value.' });
    }

    // Add coins to user
    user.coins += coinsToAdd;

    // Save the user
    await user.save();

    // Send success response
    res.status(200).send({
      message: 'Coins added successfully!',
      auth: true,
      token: req.body.token,
      role: user.role,
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while processing your request.' });
  }
};

module.exports = { followAndEarn };
