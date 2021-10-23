import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./router/users.js";
import productsRouter from "./router/products.js";
import categoryRouter from "./router/category.js";
import addressRouter from "./router/address.js";
import orderRouter from "./router/order.js";

import cartRouter from "./router/cart.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/products", productsRouter);

app.use("/cart", cartRouter);

app.use("/address", addressRouter);

app.use("/order", orderRouter);

const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methoads", 'PUT, POST, PUT, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port : ${PORT}`))
  )
  .catch((error) => console.log(error.message));
mongoose.set("useFindAndModify", false);
