import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const get = async (req, res, next) => {
  try {


  
      const categories=await main.category.findMany({
   
        orderBy: { createdAt: "desc" }, // optional
      })
    

      return res.status(200).json({
      data: categories,
      message:"Categories successfully retrieved"

    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};


export default {
  get,
};