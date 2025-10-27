import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res){
    const {email, password} = req.body;

    try{
        const exists = User.findOne({email});
        if(exists) return res.status(400).json({message: "user already exists"});
        const hash = await bcrypt.hash(password, 10)
        const user = await User.create({email, password: hash, collections: []})
        res.status(201).json({message: "user created", id: user._id})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
};

export async function login(req, res){
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "invalid credentials"})
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.status(400).json({message: "invalid password"})
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({message: "login success"})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}
export function logout(req, res){
    res.clearCookie("token");
    res.json({message: "logout success"})
}