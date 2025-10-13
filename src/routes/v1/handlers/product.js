import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const get = async (req, res, next) => {
  try {

     const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
   const [products, totalItems] = await Promise.all([
      main.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // optional
      }),
      main.product.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
      res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      },
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};


export default {
  get,
};