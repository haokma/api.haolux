import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Products from "../models/products.js";
import { getCartItems } from "../utils/cart.js";

export const addToCart = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(400).json({
        status: "error",
        error: "Some thing went wrong, please sign in ",
      });

    const userId = req.userId;

    // if (!req.body.cartItem) {
    //   return res.status(400).json({ error: "Không có sản phẩm nào được mua" }); // ko co san pham dc up
    // }

    const cartItem = {
      cartItemId: req.body.cartItemId,
      quantity: req.body.quantity,
      size: req.body.size,
    };

    const originProduct = await Products.findOne({ _id: cartItem.cartItemId });

    if (!originProduct)
      return res.status(404).json({
        status: "error",
        error: "San pham ban mua khong dung",
      });

    const cart = await Cart.findOne({ userId });

    if (cart) {
      const product = cart.cartItems.find(
        (prod) =>
          prod.cartItemId == cartItem.cartItemId && prod.size == cartItem.size
      );

      if (product) {
        let quantity = product.quantity + cartItem.quantity;

        await Cart.findOneAndUpdate(
          {
            userId,
            "cartItems._id": product._id,
          },
          { $set: { "cartItems.$.quantity": quantity } },
          { new: true, upsert: true }
        );
      } else {
        await Cart.findOneAndUpdate(
          { userId },
          { $push: { cartItems: cartItem } },
          { new: true }
        );
      }
    } else {
      const cartItems = [];

      cartItems.push(cartItem);

      const newCart = await Cart.create({
        userId,
        cartItems,
      });
    }

    //FIXME validate: san pham ko dung (ko tim thay trong Products)
    const newCart = await Cart.findOne({ userId }).populate(
      "cartItems.cartItemId",
      "title price productImage sale"
    );

    const { cartItems, totalPrice, totalProducts } = getCartItems(newCart);

    res.json({
      status: "success",
      message: "Ban da mua hang thanh cong",
      totalProducts,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePrdQuantity = async (req, res) => {
  try {
    const { slug } = req.params;

    const size = req.query.size * 1;
    const quantity = req.query.quantity * 1;

    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate(
      "cartItems.cartItemId",
      "slug"
    );

    if (!cart)
      return res.status(400).json({
        status: "error",
        error: "Do not find cart with your profile",
      });

    const originProduct = await Products.findOne({ slug }).select(
      "title sizeProduct"
    );
    
    const originSize = originProduct.sizeProduct.find(
      (item) => item.size == size
    );
    if (quantity > originSize.size) {
      return res.status(400).json({
status: "fail",
        message:
          "san pham ban mua vuot qua so luong trong kho, moi ban chon lai so luong",
      });
    }

    if (!originProduct)
      return res.status(404).json({
        status: "error",
        error: "San pham ban mua khong dung",
      });

    const product = cart.cartItems.find(
      (prod) =>
        prod.cartItemId._id == originProduct._id.toString() && prod.size == size
    );

    if (!product)
      return res.status(404).json({
        status: "error",
        error: "San pham nay khong co trong cart cua ban",
      });

    const index = cart.cartItems.findIndex(
      (prod) =>
        prod.cartItemId._id == originProduct._id.toString() && prod.size == size
    );

    // FIXME kiem tra quantity >0,
    if (quantity < 1) {
      cart.cartItems.splice(index, 1);

      await Cart.findOneAndUpdate(
        {
          userId,
        },
        { $set: { cartItems: cart.cartItems } },
        { new: true, upsert: true }
      );
    } else {
      await Cart.findOneAndUpdate(
        {
          userId,
          "cartItems._id": product._id,
        },
        { $set: { "cartItems.$.quantity": quantity } },
        { new: true, upsert: true }
      );
    }

    // FIXME quantity < so luong san pham co trong size

    const newCart = await Cart.findOne({ userId }).populate(
      "cartItems.cartItemId",
      "title slug price productImage sale"
    );

    const { cartItems, totalPrice, totalProducts } = getCartItems(newCart);

    res.json({
      status: "success",
      totalProducts,
      cartItems,
      totalPrice,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findById(id);

    if (!cart) return res.status(400).json({ message: "Khong tim thay cart" });

    await Cart.findByIdAndDelete(id);

    res.status(201).json({ message: "Cart removed success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate(
      "cartItems.cartItemId",
      "title slug price productImage sale"
    );

    console.log(userId);

    if (!cart)
      return res.status(400).json({
        status: "error",
        error: " ban chua mua san pham nao, moi dang nhap va mua hang",
      });

    const { cartItems, totalPrice, totalProducts } = getCartItems(cart);

    res.json({
      status: "success",
      result: cartItems.length,
      totalProducts,
      id: cart._id,
      cart: cartItems,
      totalPrice,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate(
"cartItems.cartItemId",
      "slug"
    );

    const item = cart.cartItems.find((_item) => _item._id == id);

    if (!item)
      return res.status(404).json({
        status: "error",
        error: "San pham nay khong co trong gio hang cua ban",
      });

    const index = cart.cartItems.findIndex((_item) => _item._id == id);

    cart.cartItems.splice(index, 1);

    await Cart.findOneAndUpdate(
      {
        userId,
      },
      { $set: { cartItems: cart.cartItems } },
      { new: true, upsert: true }
    );

    const newCart = await Cart.findOne({ userId }).populate(
      "cartItems.cartItemId",
      "title slug price productImage sale"
    );

    // if (newCart.cartItems.length < 1)
    //   return res.status(200).json({
    //     status: "fail",
    //     message: "Ban da xoa het product trong gio hang",
    //   });

    const { cartItems, totalPrice } = getCartItems(newCart);

    res.json({
      status: "success",
      result: cartItems.length,
      cartItems,
      totalPrice,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};