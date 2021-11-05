import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Products from "../models/products.js";
import sha256 from "sha256";
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

export const checkOrder = async (req, res) => {
  try {
    let total = 0;
    const { cart, totalAmount } = req.body;

    const productId = cart[0].productId;
    const payablePrice = cart[0].payablePrice;
    const product = await Products.findById(productId);
    const quantity = cart[0].purchaseQty;

    total += Number(product.price) * quantity;

    if (Number(payablePrice) !== Number(product.price)) {
      return res.status(400).json({ message: "Giá sản phẩm đã bị thay đổi" });
    }
    if (total !== totalAmount) {
      return res.status(400).json({ message: "Tổng số tiền đã bị thay đổi" });
    }

    const payment = `id_product=${productId}&price=${payablePrice}&count=${quantity}&totalAmount=${totalAmount}`;
    const key = `nguyenchihao`;
    const signature = sha256(`${key}${payment}`);

    res.status(200).json({
      status: "success",
      message: "Ban da tao ra key thành công cho đơn hàng ",
      data: {
        payablePrice,
        quantity,
        totalAmount,
      },
      signature,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const addOrder = async (req, res) => {
  try {
    const { cart, totalAmount } = req.body;

    const productId = cart[0].productId;
    const payablePrice = cart[0].payablePrice;
    const quantity = cart[0].purchaseQty;

    const payment = `id_product=${productId}&price=${payablePrice}&count=${quantity}&totalAmount=${totalAmount}`;
    const key = `nguyenchihao`;
    const signature = sha256(`${key}${payment}`);
    // Check signature
    if (req.body.signature !== signature) {
      return res.status(400).json({ message: "Xác thực không thành công" });
    }
    // Check Money
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.money < req.body.totalAmount) {
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
      totalAmount: req.body.totalAmount,
    };

    const order = await Order.create(tempOrder);

    await Cart.deleteOne({ _id: cardId });
    await User.findByIdAndUpdate(
      userId,
      {
        money: user.money - req.body.totalAmount,
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
