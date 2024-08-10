const express = require("express")
const { LoginUserView } = require("../views/UserView")
 

const userRouter = express()
userRouter.post("/login", LoginUserView)

module.exports =  userRouter