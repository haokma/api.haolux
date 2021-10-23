import UserAddress from "../models/address.js";

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const userAddress = await UserAddress.findOne({ user: userId });

    if (!userAddress)
      return res.status(400).json({
        message: "ban chua co dia chi, vui long tao dia chi",
      });

    res.status(200).json({
      status: "success",
      address: userAddress,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const tempAddress = {
      name: req.body.name,
      phone: req.body.phone,
      city: req.body.city,
      town: req.body.town,
      address: req.body.address,
    };

    const userAddress = await UserAddress.findOne({ user: userId });

    if (userAddress) {
      await UserAddress.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            address: tempAddress,
          },
        }
      );
    } else {
      await UserAddress.create({
        user: userId,
        address: tempAddress,
      });
    }

    const newAddress = await UserAddress.findOne({ user: userId }).populate(
      "address",
      "name phone"
    );

    res.status(200).json({
      status: "success",
      message: "Ban da tao dia chi thanh cong",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.userId;

    const userAddress = await UserAddress.findOne({ user: userId });
    const tempAddress = userAddress.address;

    const index = tempAddress.findIndex((item) => item._id == id);

    tempAddress.splice(index, 1);

    await UserAddress.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          address: tempAddress,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: "success",
      message: "Ban da xoa dia chi thanh cong",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await UserAddress.findByIdAndDelete(id);

    res.status(400).json({
      message: "Ban da huy dia chi thanh cong",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
