import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const get = async (req, res, next) => {
  try {
    const product = await main.product.findMany({

    });

    return res.json({
      status: 200,
      message: "get Products succesfully",
      data: product,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};


export default {
  get,
};