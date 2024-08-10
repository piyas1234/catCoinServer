const express = require('express');
const { followAndEarn } = require('../views/EarnView');
const auth = require('../middlewares/auth');
const earnRouter = express.Router();
 

earnRouter.post('/earn', auth,  followAndEarn);

module.exports = earnRouter;
