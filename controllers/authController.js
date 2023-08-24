import userModel from "../models/userModel.js";
import {comparepassword, hashPassword} from './../helpers/authHelper.js'
import JWT from 'jsonwebtoken';

export const registerController =async(req,res)=>{
     
     try{
       const {name,email,password, phone,address}=req.body
       // validation
       if(!name){
        return res.send({message:'Name is Required'}) 
       }
       if(!email){
        return res.send({message:'Email is Required'}) 
       }
       if(!password){
        return res.send({message:'Password is Required'}) 
       }
       if(!phone){
        return res.send({message:'phone Number is Required'}) 
       }
       if(!address){
        return res.send({message:'Addres is Required'}) 
       }


       // check user
       const exisitingUser =await userModel.findOne({email})
       // exisiting user
       if(exisitingUser){
        return res.status(200).send({
            success:false,
            message:'Already Register please login'
        })
       }
      // resgister user
      const hashedPassword=await hashPassword(password)
      //save
      const user = await new userModel({name,email, phone,address,password:hashedPassword}).save()
      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });


     }
     catch(error){
      console.log(error)
      res.status(500).send({
        succes:false,
        messahe:'error in registeration'
      })
     }
};

//POST LOGIN

export const loginController=async(req,res)=>{
try{
const {email,password}=req.body;
//validation
if(!email || !password){
  return res.status(404).send({
    success:false,
    message:'Invalid email or password'
  })
}
//cheack user
const user = await userModel.findOne({ email });
if (!user) {
  return res.status(404).send({
    success: false,
    message: "Email is not registerd",
  });
}
const  match = await comparepassword(password,user.password)
if(!match){
  return res.status(200).send({
    success:false,
    message:'Invaild password'
  })
}
//tokan
const token =await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d",});
res.status(200).send({
  success: true,
  message:'login successfully',
  user:{
    name: user.name,
    email:user.email,
    phone:user.phone,
    address:user.address,
    role: user.role,
  },
  token,
});
}
catch(error){
console.log(error)
res.status(500).send({
  success:false,
  message:'error in login',
  error
})
}
};

//test testController

export const testController=(req,res)=>{
 res.send('protected routes')
}

