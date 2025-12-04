import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const get = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log(req.query)
    const sort = req.query.sortBy;
    const sortOptions = {
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
    };
    const defaultSort = { createdAt: "desc" };
    const orderBy = sortOptions[sort] || defaultSort;
    const categoryIds = req.query.category
      ?.toString()
      .split(",")
      .map((id) => Number(id));
    const [products, totalItems] = await Promise.all([
      main.product.findMany({
        skip,
        take: limit,
        orderBy,
        where: {
          categoryId: {
            in: categoryIds
          }
        }
      }),
      main.product.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    res.status(200).json({
      data: products,
      message: "Products successfully retrieved",
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