const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/UserRoute");
const cors = require("cors");
const earnRouter = require("./src/routes/EarnRoute");
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const UserModel = require("./src/models/UserModel");
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("", userRouter);
app.use("", earnRouter);
app.get("/", (req, res) => {
  return res.json("Hello World");
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {})
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server
    const port = process.env.PORT || 2000;
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Error handling for MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});






// telegramme bot 



 // Replace with your own bot token
const token = process.env.TELEGRAM_TOKEN // Replace with your bot token

// Create a new instance of the TelegramBot
const bot = new TelegramBot(token, { polling: true });

// Function to send an image with description
async function sendCatCoinDetails(chatId) {
  const imageUrl = 'https://example.com/path-to-catcoin-image.jpg'; // Replace with your image URL
  const description = `**catCoin**\n\ncatCoin is a revolutionary new cryptocurrency designed for cat lovers. It aims to bring the joy of cats into the world of finance with a playful and engaging approach.\n\nFeatures:\n- **Innovative**: Uses cutting-edge technology to ensure secure transactions.\n- **Community-driven**: Developed with feedback from the cat-loving community.\n- **Rewarding**: Earn rewards for participating in cat-related activities.\n\nFor more information, visit our website or contact support.`;

  try {
    // Download the image from the URL
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    const imagePath = path.join(__dirname, 'catcoin_image.jpg');
    fs.writeFileSync(imagePath, response.data);

    // Send the image with description
    await bot.sendPhoto(chatId, imagePath, { caption: description, parse_mode: 'Markdown' });

    // Clean up the image file after sending
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete image file:', err);
    });
  } catch (error) {
    console.error('Error sending catCoin details:', error);
  }
}

// Handle /start command
// Handle /start command
bot.onText(/\/start/, async (msg) => {

  console.log(msg)
  const chatId = msg.chat.id;
  const text = msg.text;
  const startAppId = text.split('=')[1]; // Extract the startAppId if provided
  
  const userId = chatId.toString(); // Use chat ID as the user ID
  const username = `user_${userId}`; // Generate a random username
  const first_name = msg.chat.first_name || '';
  const last_name = msg.chat.last_name || '';

  try {
    // Check if user exists
    let user = await UserModel.findOne({ user_id: userId }).populate("refers");
    
    if (!user) {
      // Create a new user if not found
      user = new UserModel({
        user_id: userId,
        first_name,
        last_name,
        username,
        role: "user",
        coins: 1000, // Initial coin balance
        dailySpin: 3, // Initial daily spins
      });
      await user.save();
      console.log(`New user created: ${user.first_name} ${user.last_name}`);
    } else {
      console.log(`User already exists: ${user.first_name} ${user.last_name}`);
    }

    

    if (startAppId) {
      let referrerId;
      try {
        referrerId = new mongoose.Types.ObjectId(startAppId);
        console.log(`Valid startAppId received: ${startAppId}`);
      } catch (e) {
        console.error("Invalid ObjectId format for startAppId");
      }

      console.log(referrerId);

      if (referrerId) {
        const referrer = await UserModel.findById(referrerId);

        console.log(referrer)

        if (referrer) {
          console.log(`Referrer found: ${referrer.first_name} ${referrer.last_name}`);
          
          // Check if the user was already referred by this referrer
          if (!referrer.refers.includes(user._id)) {
            referrer.refers.push(user._id);
            referrer.coins += 10000; // Reward referrer with coins
            referrer.dailySpin += 1; // Increase daily spins for referrer
            await referrer.save();

            user.coins += 10000; // Reward new user with coins
            await user.save();

            console.log(`Referral successful: ${user.first_name} referred by ${referrer.first_name}`);
          } else {
            console.log(`User ${user.first_name} was already referred by ${referrer.first_name}`);
          }
        } else {
          console.log(`Referrer with ID ${startAppId} not found.`);
        }
      }
    }

    

    console.log(`${user.first_name} logged in successfully!`);

    // Send the welcome image
    bot.sendPhoto(chatId, 'https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg', {
      caption: `Hey, ${first_name} Welcome to Cat-coin👩🏽‍🚀`, // Title as caption
      parse_mode: "HTML"
    }).then(() => {
      // After sending the image, send a message with buttons
      bot.sendMessage(chatId, `🫵🏻 Tap the Cat-coin👩🏽‍🚀 to see your balance grow.

W-coin is the first Decentralized Application based on a unique model where the community decides on which blockchain the token will be listed - 💎 Ton, 🧬 Solana, or 🔹 Ethereum

Maybe all of them? 
The choice is yours!

Got friends, relatives, co-workers?
Bring them all into the game.
More Mates - more coin.`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Play', 
                web_app: { url: 'https://sunny-studio-342511.uc.r.appspot.com/' } // Replace with your web app URL
              },
              { 
                text: 'Join telegram group', 
                url: 'https://t.me/btc_aitoken' // Replace with your Telegram group URL
              }
            ]
          ]
        }
      });
    });
  } catch (error) {
    console.error('Error processing /start command:', error);
    bot.sendMessage(chatId, "Sorry, an error occurred. Please try again later.");
  }
});







// Handle /info command to send image and details
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  sendCatCoinDetails(chatId);
});
