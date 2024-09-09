import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';



export const isAuthenticated = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login first",
            });
        }


        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token!",
            });
        }


        const user = await User.findById(decoded?._id);


        req.user = user;

        next();


    } catch (error) {
        console.log(error);
    }
}