import dotenv from 'dotenv';
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import bcrypt from 'bcryptjs';
import connectDB from './db.js';
import User from '../models/User.js';
dotenv.config();


const run = async() => {
    try{
        await connectDB()
        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const role = process.env.ADMIN_ROLE;
        const password = await bcrypt.hash(process.env.ADMIN_PASSWORD,10);
        const newUser = new User({
            username,
            email,
            password,
            role:"admin"
        })
        await newUser.save();

        console.log('Admin user created successfully');
        } catch (error) {
            console.log(error)
        }
};
run();