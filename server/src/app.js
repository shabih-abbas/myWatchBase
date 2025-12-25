import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.use(express.json());
app.use(cookieParser());

app.head("/awake", (req, res)=>{
  res.status(200).end()
})
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/collections", collectionRoutes);

app.listen(PORT, ()=> console.log("server up"));