const jwt = require("jsonwebtoken")
const Boom = require("@hapi/boom")
const UserModel = require("../models/UserModel")

const auth = async (req, res, next) => {
  const { authorization } = req.headers
 
  try {
    const token = await authorization.split(" ")[1]
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await UserModel.findOne({
      _id: decoded.id,
    })
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.id = decoded.id
    next()
  } catch (error) {
    
    return next(Boom.unauthorized("Not authorized to access this resource"))
     
  }
}

module.exports = auth
