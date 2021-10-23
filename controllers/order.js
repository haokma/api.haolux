import Order from "../models/order.js";
import Cart from "../models/cart.js";
import UserAddress from "../models/address.js";

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

export const addOrder = async (req, res) => {
  try {
    const userId = req.userId;

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

    res.status(200).json({
      status: "success",
      message: "Ban da tao don hang thanh cong",
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
