import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res){
    const {email, password} = req.body;

    try{
        const exists = await User.findOne({email});
        if(exists) {
            console.log(exists)
            return res.status(400).json({message: "User Already Exists"});
        }
        const hash = await bcrypt.hash(password, 10)
        const user = await User.create({email, password: hash, collections: []})
        res.status(201).json({message: "User Created", id: user._id})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
};

export async function login(req, res){
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid Credentials"})
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.status(400).json({message: "Invalid Password"})
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({message: 'Login Success', user: user._id})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}
export function authenticate(req, res){
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: "No token"})
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.id)
        token = jwt.sign({id : decoded.id}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.status(200).json({user: decoded.id});
    }
    catch(err){
        res.status(403).json({message: "Token Expired or Invalid"});
    }
}
export function logout(req, res){
    res.clearCookie("token");
    res.json({message: "Logout Success"})
}