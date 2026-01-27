import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const register = async (req, res, next) => {
    try {

        const { firstName, lastName, email, password, phone } = req.body
        const hashedPassword= helper.encryptText(password)
        return res.status(200).json({
            data: {},
            message: "Categories successfully retrieved"

        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};


export default {
    register,
};