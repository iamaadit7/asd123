import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

var checkUserAuth = async(req,res, next)=>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {

            // get token from header
            token = authorization.split(' ')[1]
            console.log("Token", token)
            console.log("Authorization", authorization)

            // verify token
            const{userID}= jwt.verify(token , process.env.JWT_SECRET_KEY)
            console.log(userID)

            // Get user from token
            req.user =await userModel.findById(userID).select('-password')
            await userModel.findByIdAndUpdate(req.user_id, {$set: {password : newHashPassword}})
             console.log(req.user)
            next()
        } catch (error) {
            console.log(error)
            res.status(401).send({"status": "failed", "message":"Unauthrorised User"})
            
        }
    }
    if (!token){
        res.status(401).send({"status": "failed", "message":"Unauthrorised User, No token"})
            
    }
}

export default checkUserAuth