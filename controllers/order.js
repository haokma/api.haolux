import CryptoJs from "crypto-js";
import Hex from "crypto-js/enc-hex.js";
import sha256 from "crypto-js/sha256.js";
import encode from "nodejs-base64-encode";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Products from "../models/products.js";
import User from "../models/user.js";
export const getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId })
      .populate("user", "name")
      .populate("items.productId", "title price productImage");

    if (!orders)
      return res.status(400).json({
        status: "error",
        error: "Khong tim thay don hang cua ban",
      });

    res.status(200).json({
      status: "success",
      orders,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name")
      .populate("items.productId", "title price productImage");

    if (!order)
      return res.status(400).json({
        status: "error",
        error: "Khong tim thay don hang cua ban",
      });

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getListOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const order = await Order.find({
      user: userId,
    })
      .populate("user", "name")
      .populate("items.productId", "title price productImage");

    if (!order)
      return res.status(400).json({
        status: "error",
        error: "Khong tim thay don hang cua ban",
      });

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const checkOrder = async (req, res) => {
  try {
    let total = 0;
    const { cart, totalAmount } = req.body;

    for (let i = 0; i < cart.length; i++) {
      const productId = cart[i].productId;
      const payablePrice = cart[i].payablePrice;
      const product = await Products.findById(productId);
      const quantity = cart[i].purchaseQty;
      if (Number(payablePrice) !== Number(product.price)) {
        return res.status(400).json({ message: "Giá sản phẩm đã bị thay đổi" });
      }
      total += Number(product.price) * quantity;
    }

    if (total !== totalAmount) {
      return res.status(400).json({ message: "Tổng số tiền đã bị thay đổi" });
    }
    let payment = "";
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        payment += `${key}:${req.body[key]}` + `&`;
      } else {
        payment += `${key}:${JSON.stringify(req.body[key])}` + `&`;
      }
    }
    payment = payment.substring(0, payment.length - 1).replace(/\"/g, "'");
    const key = `nguyenchihao2001`;
    const check = `${key}${payment}`;
    const signature = Hex.stringify(sha256(check));
    payment = payment + "&Signature:" + signature;
    payment = encode.encode(payment, "base64");

    res.status(200).json({
      status: "success",
      message: "Ban da tao ra key thành công cho đơn hàng ",
      cart,
      payment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const addOrder = async (req, res) => {
  try {
    const SIGNATURE = "265369676e61747572653a";
    let payment = req.body.payment;
    const payment_hex = Buffer.from(payment, "base64").toString("hex");

    const Position_of_Signature = payment_hex.indexOf(SIGNATURE);

    const Signature_hex = payment_hex.slice(
      Position_of_Signature + SIGNATURE.length,
      payment_hex.length
    );

    const Data_hex = payment_hex.slice(0, Position_of_Signature);

    const private_sign_key_hex =
      Buffer.from("nguyenchihao2001").toString("hex");

    const a = CryptoJs.SHA256(
      CryptoJs.enc.Hex.parse(private_sign_key_hex + Data_hex)
    ).toString();

    if (a !== encode.decode(Signature_hex, "hex")) {
      return res.status(400).json("Signature không hợp lệ có thể đã bị sửa");
    }
    const data = encode.decode(payment, "base64");

    const data_analysis = data.split("&");
    const data_new = {};
    for (let i = 0; i < data_analysis.length; i++) {
      const arr = data_analysis[i].split(":");
      const key = arr[0];
      const value = arr[1];
      data_new[key] = value;
    }

    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.money < data_new["totalAmount"]) {
      return res
        .status(400)
        .json({ message: "Không đủ tiền để thanh toán đơn hàng này" });
    }

    const cardId = req.body.cardId;

    const tempAddress = {
      name: req.body.name,
      phone: req.body.phone,
      city: req.body.city,
      town: req.body.town,
      address: req.body.address,
    };

    const tempOrder = {
      user: userId,
      items: req.body.cart,
      orderStatus: [
        {
          type: "order",
          date: new Date(),
          isCompleted: true,
        },
      ],
      fee: req.body.fee,
      address: tempAddress,
      totalAmount: data_new["totalAmount"],
    };

    const order = await Order.create(tempOrder);

    await Cart.deleteOne({ _id: cardId });
    await User.findByIdAndUpdate(
      userId,
      {
        money: user.money - data_new["totalAmount"],
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Bạn đã tạo đơn hàng thành công",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    res.status(200).json({
      message: "update order success",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order)
      return res.status(400).json({ message: "Khong tim thay order" });

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: "Ban da huy don hang thanh cong",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
