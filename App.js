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



 

// // Replace with your own bot token
// const token = '7383728340:AAG_2xM5EXxXUa-k8rEazjhqGiahLD4J5tg';

// // Create a new instance of the TelegramBot
// const bot = new TelegramBot(token, { polling: true });

// // Function to send an image with description
// async function sendCatCoinDetails(chatId) {
//   const imageUrl = 'https://example.com/path-to-catcoin-image.jpg'; // Replace with your image URL
//   const description = `**catCoin**\n\ncatCoin is a revolutionary new cryptocurrency designed for cat lovers. It aims to bring the joy of cats into the world of finance with a playful and engaging approach.\n\nFeatures:\n- **Innovative**: Uses cutting-edge technology to ensure secure transactions.\n- **Community-driven**: Developed with feedback from the cat-loving community.\n- **Rewarding**: Earn rewards for participating in cat-related activities.\n\nFor more information, visit our website or contact support.`;

//   try {
//     // Download the image from the URL
//     const response = await axios({
//       url: imageUrl,
//       responseType: 'arraybuffer',
//     });

//     const imagePath = path.join(__dirname, 'catcoin_image.jpg');
//     fs.writeFileSync(imagePath, response.data);

//     // Send the image with description
//     await bot.sendPhoto(chatId, imagePath, { caption: description, parse_mode: 'Markdown' });

//     // Clean up the image file after sending
//     fs.unlink(imagePath, (err) => {
//       if (err) console.error('Failed to delete image file:', err);
//     });
//   } catch (error) {
//     console.error('Error sending catCoin details:', error);
//   }
// }

// // Handle /start command
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   console.log(msg)
  
//   // Send the image first
//   bot.sendPhoto(chatId, 'https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg', {
//     caption: `Hey, ${msg?.chat?.first_name.toString()} Welcome to Cat-coin👩🏽‍🚀`, // Title as caption
//     parse_mode: "HTML"
//   }).then(() => {
//     // After sending the image, send a message with buttons
//     bot.sendMessage(chatId, `🫵🏻 Tap the Cat-coin👩🏽‍🚀 to see your balance grow.

// W-coin is the first Decentralized Application based on a unique model where the community decides on which blockchain the token will be listed - 💎 Ton, 🧬 Solana, or 🔹 Ethereum

// Maybe all of them? 
// The choice is yours!

// Got friends, relatives, co-workers?
// Bring them all into the game.
// More Mates - more coin ( make this good design html format `, {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: 'Play', callback_data: '@CatSwapCoin_bot',   web_app: { url: '@CatSwapCoin_bot' } },
//             { text: 'Join telegram group', callback_data: 'button2' },
             
//           ]
//         ]
//       }
//     });
//   });
// });

// // Handle /info command to send image and details
// bot.onText(/\/info/, (msg) => {
//   const chatId = msg.chat.id;
//   sendCatCoinDetails(chatId);
// });
