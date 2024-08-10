 
const UserModel = require('../models/UserModel');

const ObjectId = require('mongodb').ObjectId;

const followAndEarn = async (req, res) => {
  try {
    
    const userId = new ObjectId(req.id);
    const user = await UserModel.findById(userId);
    user.coins += req.body.coins;  
    const token = req.body.token;  
    
    await user.save();

    res.status(200).send({
      message: `Coins added successfully!`,
      auth: true,
      token:token,
      role: user.role,
      user: user,
    });

     
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while processing your request.' });
  }
};

module.exports = { followAndEarn };
