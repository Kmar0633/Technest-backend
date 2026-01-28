import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const register = async (req, res, next) => {
    try {
   console.log("test")
        const { firstName, lastName, email, password, phone } = req.body
        const userData = { firstName, lastName, email, password: helper.encryptText(password), phone }

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
            secure: true,
            sameSite: "strict",
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
                phone:user.phone
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


export default {
    register,
};