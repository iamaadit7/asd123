import UserModel from '../models/user.js'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
import transporter from '../config/emailConfig.js'

// USER REGISTRATION MODULE
class UserController {
    static userRegistration = async (req,res)=>{
     const {name,email,password,password_confirmation, tc} = req.body   // data coming from registration to be saved 
     const user = await UserModel.findOne({email:email}) //searchiong for same email if any
     if (user){
        res.send({"status": "failed", "message":"email already exists"})
     }else{
        if(name && email && password_confirmation && tc){     //checking all details are filled
          if(password ===password_confirmation){
            try{
            const salt = await bcrypt.genSalt(12)
            const hashPassword = await bcrypt.hash(password,salt)
            const doc = new UserModel ({    //getting into db
                name:name,
                email:email,
                password:hashPassword,
                tc:tc
            })
            await doc.save()
            const saved_user= await UserModel.findOne({email:email})   
            //token jwt
            const token= jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY, {expiresIn:'2d'})
            res.status(201).send({"status": "Success", "message":"user resgistered","token":token})
        }
        catch(error){
            console.log(error)
            res.send({"status": "failed", "message":"unabale to resgister"})
            }
        }else{
                res.send({"status": "failed", "message":"password not matched"})
            }
          }else{
            res.send({"status": "failed", "message":"all req fields"})
        }
     }
    }

    // USER LOGIN MODULE...................
    static userLogin = async (req,res)=>{
        try{
        const {email,password} =req.body
        if(email && password){
            const user = await UserModel.findOne({email:email}) //searchiong for same email if any in db
            if(user !=null){
            const isMatch = await bcrypt.compare(password , user.password)
            if((user.email==email) && isMatch){
               
                //jwt token 
                const token= jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY, {expiresIn:'2d'})
                res.send({"status": "Sucess", "message":"Yor are logged success", "token":token})
            }else{
                res.send({"status": "failed", "message":"email or password not matched"})
            }
            }else {
                res.send({"status": "failed", "message":"user not reqestered"})
            }
        }else{
            res.send({"status": "failed", "message":"all req fields"})
        }
        }catch(error){
            console.log(error)
            res.send({"status": "failed", "message":"Nota able to logg in "})
        }
    }

    //FORGET PASSWORD MODULE...

    static changeUserPassword = async (req,res)=>{
        const {password,password_confirmation} = req.body
        if (password && password_confirmation){
        
        if(password!==password_confirmation){
        res.send({"status": "failed", "message":"Both password not matchedn "})
        }else{
        const salt= await bcrypt.genSalt(12)
        const newHashPassword = await bcrypt.hash(password,salt)
        await UserModel.findOneAndUpdate(req.user._id,{$set:{password:newHashPassword}})
        //console.log(req.user)
        res.send({"status": "success", "message":"password changed "})
        }
        } else{
            res.send({"status": "failed", "message":"All fields erq "})
        }

    }
    // get logged user data
    static loggedUser = async (req,res)=>{
        res.send({"user":req.user})
    }

    //Reset email

    static sendUserPasswordResetEmail= async (req,res)=>{
        const {email}= req.body
        if(email){
        const user = await UserModel.findOne({email :email})
        if(user){
            
            const secret = user._id + process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '5m' });
            const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`; 
            console.log(link);

            //send email nodemailer

            let info = await transporter.sendMail({
                from: 'eddie.rawat@gmail.com',
                to: user.email,
                subject: "ProjectNode- Password reset link",
                html: `<a href= ${link}> click here </a> to reset your password`
            })

            res.send({"status":"sucess", "message":"password reset link send... check your email","info":info})
        }else{
            res.send({"status":"failed", "message":"email doest exsit"})
        }
        }else{
            res.send({"status":"failed", "message":"email field required"})
        }
    }

    //password reset

    static userPasswordReset= async(req,res)=>{
        const{password ,password_confirmation} = req.body
        const {id, token}= req.params
        const user = await userModel.findById(id)
        const new_secret = user._id +process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token, new_secret)
            if(password && password_confirmation){
           if (password!==password_confirmation){
            res.send({"status":"failed", "message":"Passwords not matched"})
       } else{
        const salt = await bcrypt.genSalt(12)
        const newHashPassword= await bcrypt.hash(password,salt)
        await UserModel.findOneAndUpdate(user._id,{$set:{password:newHashPassword}})
        res.send({"status":"success", "message":"password reset successfulli"})

       }
            }else{
                res.send({"status":"failed", "message":"all  field required"})
            }

        } catch (error) {
            console.log(error)
            res.send({"status":"failed", "message":"Invalid tokens"})
            
        }
    }
}



export default UserController