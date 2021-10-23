import slugify from "slugify";
import Category from "../models/category.js";

const cateList = (categories, parentId = null) => {
  const list = [];

  let category = [];

  if (parentId == null) {
    category = categories.filter((_cate) => _cate.parentId == undefined);
  } else {
    category = categories.filter((_cate) => _cate.parentId == parentId);
  }

  for (let cate of category) {
    list.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      slug: cate.slug,
      children: cateList(categories, cate._id),
    });
  }

  return list;
};

export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().select("name slug parentId");

    if (!categories)
      return res.status(404).json({
        status: "fail",
        error: "Do not found categories",
      });

    const listOfCategory = cateList(categories);

    res.status(201).json({
      status: "success",
      category: categories,
      categories: listOfCategory,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
}
export async function addCategory(req, res) {
  try {
    const { name } = req.body;

    const tempCate = {
      name,
      slug: slugify(name),
    };

    if (req.body.parentId) {
      tempCate.parentId = req.body.parentId;
    }

    const newCategory = await Category.create(tempCate);

    res.status(201).json({
      status: "success",
      category: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
}
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category)
      res.status(404).json({
        status: "failf",
        error: "Do not find category",
      });

    const tempCate = {};

    if (req.body.parentId) {
      tempCate.parentId = req.body.parentId;
    }

    if (req.body.name) {
      tempCate.name = req.body.name;
      tempCate.slug = slugify(req.body.name);
    }

    await Category.findByIdAndUpdate(id, tempCate);

    if (req.body.parentId) {
      tempCate.parentId = req.body.parentId;
    }

    res.status(200).json({
      status: "success",
      message: "Update category successful",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
}
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category)
      res.status(404).json({
        status: "failf",
        error: "Do not find category",
      });

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Delete category successful",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
}
