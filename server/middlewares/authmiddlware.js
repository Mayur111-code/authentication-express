const jwt = require ('jsonwebtoken');
const UserModel = require("../models/user");

module.exports.authMiddleware = async (req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                message : "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
      req.user =  await UserModel.findById(decoded.id)
      next();
    } catch (error) {
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
}



