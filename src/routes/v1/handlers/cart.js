import db from "../../../../db/db.js";
import helper from "../helpers/helper.js";
import config from "../../../../config/config.js";
import { UserType } from "@prisma/client";
import jwt from "jsonwebtoken"

const { main } = db;



const mergeCarts = async (req, res, next) => {
    try {
        console.log(req.body)
        const guestItems = req.body.cart
        const userId = helper.verifyBearerToken(req.headers.authorization, res).userId
        console.log("userId", userId)
        console.log(guestItems)

        await main.$transaction(async (tx) => {
            const cart = await main.cart.findUnique({
                where: { userId: userId },
            });

            const user = await main.user.findUnique({
                where: { id: userId },
            });
            if (!cart) {
                throw new Error("Cart not found");
            }

            for (const guestItem of guestItems) {
                console.log("guestItem", guestItem)
                const product = await main.product.findUnique({
                    where: { id: guestItem.id },
                    select: { stock: true },
                });

                if (!product || product.stock <= 0) continue;

                const existing = await main.cartItem.findUnique({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: guestItem.id,
                        },
                    },
                });

                const newQty = existing
                    ? Math.min(existing.quantity + guestItem.quantity, product.stock)
                    : Math.min(guestItem.quantity, product.stock);

                if (existing) {
                    await main.cartItem.update({
                        where: { id: existing.id },
                        data: { quantity: newQty },
                    });
                } else {
                    await main.cartItem.create({
                        data: {

                            product: {
                                connect: { id: guestItem.id }
                            },
                            quantity: newQty,
                            cart: {
                                connect: { id: cart.id }
                            },
                            user: {
                                connect: { id: user.id }
                            },
                        },
                    });
                }
            }
        });
        const userCart = await main.cart.findUnique({
            where: { userId: userId },
            include: {
                items: {
                    include: {
                        product: true
                    },
                },
            },
        });

        return res.status(201).json({
            data: userCart,
            message: "Cart Merged",
        });
    } catch (e) {
        console.log(e)

        next(e);
    }
};

const getCart = async (req, res, next) => {
    try {
        const payload = helper.verifyBearerToken(req.headers.authorization, res)

        const userCart = await main.cart.findUnique({
            where: { userId: payload.userId },
            include: {
                items: {
                    include: {
                        product: true
                    },
                },
            },
        });

        const cart = []
        for (const item of userCart?.items) {
            cart.push(item?.product);
        }

        return res.status(201).json({
            data: cart,
            message: "Successfully Fetched Cart",
        });
    } catch (e) {
        console.log(e)

        next(e);
    }
};



const addProductQuantity = async (req, res, next) => {
    try {
        const payload = helper.verifyBearerToken(req.headers.authorization, res)
        const { productId,actionType } = req.body
        const userCart = await main.cart.findUnique({
            where: { userId: payload.userId },
         
        });

        const cartItemUpdated = await main.cartItem.update({
            where: { userId: payload.userId, cartId:userCart.id },
            data:{ quantity: { increment:  1 }}
            
        });

    
        return res.status(201).json({
            data: userCart,
            message: "Successfully Added Product Quantity",
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