import mongoose from 'mongoose'

//define schema

const userSchema= new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    tc:{type:Boolean, required:true}    //term cond chck box
})

//creating model

const userModel = mongoose.model("user",userSchema)

export default userModel