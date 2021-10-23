import mongoose from "mongoose";
import slugify from "slugify";
import Products from "../models/products.js";
import Category from "../models/category.js";
import constant from "../constant.js";

export const getProducts = async (req, res) => {
  try {
    let search = "BASESEARCHTERM";

    let executedFields = [
      "`",
      "~",
      "!",
      "@",
      "#",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "+",
      "=",
      "|",
      "?",
      "/",
      "<",
      ">",
    ];

    if (!req.query.search) {
      search = search;
    } else {
      search = req.query.search;
    }

    executedFields.forEach((item) => {
      if (search.indexOf(item) > -1) {
        search = "EXECUTESEARCHTERM";
      } else {
        search = search;
      }
    });

    if (search === "BASESEARCHTERM")
      return res.status(400).json({
        message: "Moi ban nhap tu can tim",
      });

    if (search === "EXECUTESEARCHTERM")
      return res.status(400).json({
        message: "Tu ban tim khong dung, vui long nhap lai tu khoa tim kiem",
      });

    let regexp = new RegExp(search);

    const queryProd = Products.find({ title: regexp });

    // let regexp = new RegExp(slugify(search));

    // const queryProd = Products.find({ slug: regexp });

    const tempProducts = await queryProd;

    let page = req.query.page * 1 || constant.initialPage;
    let limit = req.query.limit * 1 || constant.initialLimit;
    let skip = (page - 1) * limit;

    const totalProducts = tempProducts.length;

    let totalPage = Math.ceil(totalProducts / limit);

    if (req.query.page) {
      if (skip >= totalProducts)
        return res.status(400).json({
          status: "error",
          error: "This page does not exist",
        });
    }

    const products = await queryProd.skip(skip).limit(limit);

    if (products.length > 0) {
      res.status(201).json({
        status: "success",
        result: products.length,
        totalPage,
        products,
      });
    } else
      res.status(201).json({
        message: "Do not find products",
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getInitialData = async (req, res) => {
  try {
    const { limitSaleProducts, limitNewProducts } = constant;

    const saleProducts = await Products.find()
      .sort({ sale: -1 })
      .skip(0)
      .limit(limitSaleProducts);

    const newProducts = await Products.find()
      .sort({ createAt: -1 })
      .skip(0)
      .limit(limitNewProducts);

    if (!saleProducts || !newProducts)
      return res.status(404).json({
        message: "Some thing went wrong Do not find products ",
      });

    res.status(201).json({
      status: "success",
      resultSaleProduct: saleProducts.length,
      resultNewProduct: newProducts.length,
      saleProducts,
      newProducts,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProducstBySlug = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    let queryObj = { ...req.query };
    // console.log(queryObj);

    let executedFields = ["sort", "fields", "page", "limit"];
    executedFields.map((el) => delete queryObj[el]);

    const category = await Category.findOne({ slug: categorySlug });

    if (!category)
      return res.status(404).json({
        message: "Do not find category with this slug",
      });

    const tempCateId = await category._id.toString();

    const productsByCate = Products.find({
      category: tempCateId,
    });

    let min = queryObj.minPrice || constant.minPrice;
    let max = queryObj.maxPrice || constant.maxPrice;

    let queryRating = {};

    if (req.query.rating) {
      queryRating = { rating: req.query.rating };
    } else {
      queryRating = {};
    }

    // console.log(queryRating);

    let queryProdByRating = productsByCate.find(queryRating);

    let queryProd = queryProdByRating.find({ price: { $gt: min } }).find({
      price: { $lte: max },
    });

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryProd = queryProd.sort(sortBy);
    } else {
      queryProd = queryProd.sort("createAt");
    }

    if (req.query.fields) {
      let filedsName = req.query.fields.split(",").join(" ");
      queryProd = queryProd.select(filedsName);
    } else {
      queryProd = queryProd.select("-__v");
    }

    const tempProducts = await queryProd;

    let page = req.query.page * 1 || constant.initialPage;
    let limit = req.query.limit * 1 || constant.initialLimit;
    let skip = (page - 1) * limit;

    const totalProducts = tempProducts.length;
    let totalPage = Math.ceil(totalProducts / limit);

    if (req.query.page) {
      if (skip >= totalProducts)
        return res.status(400).json({
          status: "error",
          error: "This page does not exist",
        });
    }

    queryProd = queryProd.skip(skip).limit(limit);

    const products = await queryProd;
    if (products.length > 0) {
      res.status(201).json({
        status: "success",
        result: products.length,
        totalPage,
        products,
      });
    } else
      res.status(201).json({
        message: "Do not find products",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { productSlug } = req.params;

    const { relatedValue } = constant;

    const product = await Products.findOne({ slug: productSlug });

    if (!product)
      return res.status(201).json({
        message: "Do not find products with this slug",
      });

    const underPrice = product.price - relatedValue;
    const upperPrice = product.price + relatedValue;

    const relatedProducts = await Products.find({
      price: { $gte: underPrice },
    }).find({ price: { $lt: upperPrice } });

    res.status(201).json({
      status: "success",
      product,
      relatedProducts: {
        result: relatedProducts.length,
        relatedProducts,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      productImage,
      category,
      sizeProduct,
      price,
      sale,
      rating,
      reviews,
      createAt,
    } = req.body;

    const slug = slugify(title);
    let quantity = sizeProduct.reduce((acc, e) => {
      return e.quantity + acc;
    }, 0);
    const product = await Products.findOne({ slug });
    if (product) {
      return res.status(404).send("Product already exist!!");
    }
    const newProduct = new Products({
      title: title.toLowerCase(),
      description,
      productImage,
      category,
      sizeProduct,
      price,
      quantity,
      sale,
      slug,
      rating,
      reviews,
      createAt,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id: _id } = req.params;
  const product = req.body;

  const quantity = product.sizeProduct.reduce((initial, e) => {
    e.quantity += initial;
  }, 0);

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Nothing update with that ID");
  const updatedProduct = await Products.findByIdAndUpdate(_id, product, {
    new: true,
  });
  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Nothing delete with that ID");
  await Products.findByIdAndRemove(id);
  res.json({ message: "Delete successful" });
};
