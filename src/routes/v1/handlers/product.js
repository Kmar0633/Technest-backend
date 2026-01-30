import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
const { main } = db;

const get = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

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
  .map((id) => Number(id))
  .filter(Boolean);

const priceRangeMin = req.query.priceRangeMin
  ? Number(req.query.priceRangeMin)
  : undefined;

const priceRangeMax = req.query.priceRangeMax
  ? Number(req.query.priceRangeMax)
  : undefined;

// ✅ build where dynamically
const where = {};

if (categoryIds?.length) {
  where.categoryId = {
    in: categoryIds,
  };
}

if (priceRangeMin !== undefined || priceRangeMax !== undefined) {
  where.price = {
    ...(priceRangeMin !== undefined ? { gte: priceRangeMin } : {}),
    ...(priceRangeMax !== undefined ? { lte: priceRangeMax } : {}),
  };
}

const [products, totalItems] = await Promise.all([
  main.product.findMany({
    skip,
    take: limit,
    orderBy,
    where,
  }),
  main.product.count({ where }), // IMPORTANT: same filters
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


const getProductDetail = async (req, res, next) => {
  try {

   
    const { id } = req.params;
    
    const product = await Promise.all([
      main.product.findFirst({
        where: {
          id: parseInt(id)
        }
      }),
    ]);

    res.status(200).json({
      data: product,
      message: "Product successfully retrieved",
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default {
  get,
  getProductDetail
};