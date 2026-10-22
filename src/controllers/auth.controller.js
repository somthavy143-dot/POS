import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const signup = async(req,res ,next)=>{
    try {
        const {username,email,password,role} = req.body
        const existUser = await User.findOne({email})
        if(existUser)return res.status(400).json({success:false,error:"User ready exist!"})
            if(req.user.role !== "admin" && req.body.role=="manager"){
                return res.status(403).json({
                    success : false,
                    error: "only admin can create manager account"
                })
            }
        
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            username,
            email,
            password:hashPassword,
            role
        })
        delete newUser.password
        res.status(201).json({
            success:true,
            result :newUser
        })
    } catch (error) {
        next(error)
    }
}

export const signin = async(req,res,next)=>{
    try {
        const {email,password} = req.body
        // find user
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                error:"Invalid email or password"
            })
        }
        // compare password
        const isMatched = await bcrypt.compare(password,user.password)
        if(!isMatched){
            return res.status(401).json({
                success:false,
                error:"Invalid email or password"
            })
        }
        // create token
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
        
        // set cookie
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"none",
            maxAge: 7*24*60*60*1000
        })
        res.status(200).json({
            success:true,
            user:{
                username:user.username,
                email:user.email,
                role:user.role
            }
        })
    } catch (error) {
        next(error)
    }
}

// sign out

export const signout = async (req,res,next) => {
    try {
        res.clearCookie ('token',{
            httpOnly: true,
            secure: false,
            sameSite: "none"
        })
        res.status (200).json ({
            success: true,
            message: "Sign out success!"
        })
    } catch (error) {
        next (error)
    }
}