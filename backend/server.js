const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./model/user');
const Task = require('./model/task');
const MongoStore = require('connect-mongo');
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = 5000;
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;


const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173','https://31ec9935-6b8d-464c-84b7-ee91541cce62-00-2okr80w4xnq04.pike.replit.dev:3000'];


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(
    cors({
        origin: (origin, callback)=>{
            if(!origin || allowedOrigins.includes(origin)){
                callback(null,true);
            }else{
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }) 
);

app.use(session({
  secret: 'aesdththbgju',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000, 
  },
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    ttl: 24 * 60 * 60, 
    autoRemove: 'disabled',
  }),
}));

app.get('/', (req, res) => {
    res.send('MongoDB connection setup complete!');
});

app.post('/register',async (req,res)=>{
    try{
        const {username,password, fullname,email}=req.body;
        const hashedPassword =await bcrypt.hash(password, 8);
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: 'Username already exists'});
        }
        const newUser = new User({
            username,
            password: hashedPassword,
            fullname,
            email,
        });
        await newUser.save();
        req.session.userId = newUser._id;
        res.status(201).json({message: 'User registered successfully'});
        console.log('User registered successfully');
        
    }catch(error){
        console.error('Error registering user:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

app.post('/login',async (req,res)=>{
    try{
        const {username,password}=req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: 'Invalid username or password'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid username or password'});
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2h" });
            res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 2 * 60 * 60 * 1000,
        });
        // req.session.userId = user._id;
        res.status(200).json({message: 'Login successful'});
        console.log('Login successful');
    }catch(error){
        console.error('Error logging in:', error);
    }
})

app.get('/me',async (req,res)=>{
    try{
        //console.log("Cookies received:", req.cookies);
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "unauthorized" });
        }
        const decoded=jwt.verify(token,JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(404).json({message:"User not found"});
        res.json({user:user});
    }catch(error){
        console.error("Error: "+ error)
        res.status(401).json({message:"Unauthorized"});

    }
});

app.get('/refresh', async (req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token) return res.status(401).json({message:"unauthorized"});
        const decoded=jwt.verify(token,JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(404).json({message:"User not found"});
        const newToken = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:"2h"});
        res.cookie("token",newToken,{
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000, 
        });
        res.json({success:"Token refreshed successfully"});
    }catch(error){
        console.error("Refresh Token Error: "+ error)
        res.status(401).json({message:"Unauthorized"});
    }
})

app.get('/addTask', async (req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token) return res.status(401).json({message:"unauthorized"});
        const {title,description,priority}=req.body;
        const decoded=jwt.verify(token,JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(404).json({message:"User not found"});
        const newTask=new Task({
            title,
            description,
            priority,
            user:user._id,
        });
        await newTask.save();
        res.status(201).json({message:"Task created successfully"});
        console.log("Task created successfully");
    }catch(error){
        console.log("Error: "+ error)
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});