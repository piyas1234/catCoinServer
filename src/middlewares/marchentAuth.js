import jwt from "jsonwebtoken"
import Boom from "@hapi/boom"
import UserModel from "./../models/UserModel"

const merchantAuth = async (req, res, next) => {
  const { authorization } = req.headers
  try {
    const token = await authorization.split(" ")[1]
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await UserModel.findOne({
      _id: decoded.id,
      role: decoded.role,
    })
    if (!user) {
      throw new Error()
    }
    
    if (user.role !== "merchant" || "admin") {
      throw new Error()
    }

    req.user = user
    req.id = decoded.id
    req.role = decoded.role
    next()
  } catch (error) {
    return next(Boom.unauthorized("Not authorized to access this resource"))
  }
}

export default merchantAuth
