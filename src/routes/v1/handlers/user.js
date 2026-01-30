import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
import { UserType } from "@prisma/client";
import jwt from "jsonwebtoken"
const { main } = db;

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body
        const userData = { firstName, lastName, email, password: helper.encryptText(password), phone, userType: UserType.USER }

        const findUser = await main.user.findUnique({ where: { email } });

        if (findUser) {

            return res.status(401).json({ message: "Email already exists" })
        }
        const user = await main.user.create({

            data: userData, // optional
        })

        const accessToken = helper.generateAccessToken(user.id);
        const refreshToken = helper.generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite:"none",
            path: "/auth/refresh",
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
            message: "Account created successfully",
        });
    } catch (e) {
        console.log(e)
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already exists",
            });
        }
        next(e);
    }
};


const getUser = async (req, res, next) => {
    try {
        const payload = helper.verifyBearerToken(req.headers.authorization, res)

        const user = await main.user.findUnique({ where: { id: payload?.userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ status: "success", data: user });
    } catch (e) {
        console.log(e)
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already exists",
            });
        }
        next(e);
    }
};

const saveUser = async (req, res, next) => {
    try {
     
        const payload = helper.verifyBearerToken(req.headers.authorization, res)

        const reqBody = req.body;
        const user = await main.user.findUnique({ where: { id: payload?.userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await main.user.update({
            where: { id: payload?.userId },
            data: reqBody,
        });
        res.json({ status: "success", data: updatedUser });
    } catch (e) {
        console.log(e)
        next(e);
    }
};



const login = async (req, res, next) => {
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
            sameSite: "none",
            path: "/auth/refresh",
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



export default {
    register,
    login,
    saveUser,
    getUser
};