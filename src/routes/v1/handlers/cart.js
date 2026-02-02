import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
import { UserType } from "@prisma/client";
import jwt from "jsonwebtoken"
const { main } = db;



const mergeCarts = async (req, res, next) => {
    try {

        const { email, password } = req.body

        const user = await main.user.findUnique({ where: { email } });

        if (!user || user?.password != helper.encryptText(password)) {

            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        const accessToken = helper.generateAccessToken(user.id);
        const refreshToken = helper.generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
             sameSite: "lax", 
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                userType: user.userType
            },
            message: "Successfully Logged In",
        });
    } catch (e) {
        console.log(e)

        next(e);
    }
};

const getCart = async (req, res, next) => {
    try {
       
        return res.status(201).json({
         
            message: "Successfully Fetched Cart",
        });
    } catch (e) {
        console.log(e)

        next(e);
    }
};


export default {
    mergeCarts,
    getCart,
   
};