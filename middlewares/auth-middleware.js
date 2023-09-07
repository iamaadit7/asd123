// import jwt from 'jsonwebtoken';
// import userModel from '../models/user.js';


// var checkUserAuth = async(req,res, next)=>{
//     let token
//     const {authorization} = req.headers
//     if(authorization && authorization.startsWith('Bearer')){
//         try {

//             // get token from header
//             token = authorization.split(' ')[1]
//             //console.log("Token", token)
//             //console.log("Authorization", authorization)

//             // verify token
//             const{userID}= jwt.verify(token , process.env.JWT_SECRET_KEY)
//             console.log(userID)

//             // Get user from token
//             req.user =await userModel.findById(userID).select('-password')
//             **if (req.body.newHashPassword) {
//             const newHashPassword = req.body.newHashPassword; // Replace with the actual source of the new password
//             await userModel.findByIdAndUpdate(userID, { $set: { password: newHashPassword } });
//          } **
//             await userModel.findByIdAndUpdate(req.user._id, {$set: {password : newHashPassword}})
//              console.log(req.user)
//             next()
//         } catch (error) {
//             console.log(error)
//             res.status(401).send({"status": "failed", "message":"Unauthrorised User"})
            
//         }
//     }
//     if (!token){
//         res.status(401).send({"status": "failed", "message":"Unauthrorised User, No token"})
            
//     }
// }

// export default checkUserAuth

import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

var checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = authorization.split(' ')[1];

            // Verify token
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(userID);

            // Get user from token
            req.user = await userModel.findById(userID).select('-password');

            // Check if you have a new password available, and update the user's password
            if (req.body.newHashPassword) {
                const newHashPassword = req.body.newHashPassword; // Replace with the actual source of the new password
                await userModel.findByIdAndUpdate(userID, { $set: { password: newHashPassword } });
            }

            console.log(req.user);
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({ "status": "failed", "message": "Unauthorized User" });
        }
    }

    if (!token) {
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No token" });
    }
};

export default checkUserAuth;
