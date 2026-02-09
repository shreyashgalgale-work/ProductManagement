const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const redisClient = require("redis").createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
const app = express();
const PORT = process.env.PORT || 5000;

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

(async () => {
    await redisClient.connect();
    console.log("✅ Redis connected");
})();

const getProducts = async () => {
    const products = await redisClient.get("products");

    if (products) {
        return JSON.parse(products);
    }
    return [];
};
const setProducts = async (products) => {
    await redisClient.set("products", JSON.stringify(products));
};

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS",
    );
    next();
});

app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Welcome to the MERN-Template API!",
    });
});

app.get("/details", (req, res, next) => {
    res.status(200).json({
        name: "MERN-Template",
    });
});

app.get("/products", async (req, res, next) => {
    const products = await getProducts();
    res.status(200).json({ products });
});

app.post("/product", async (req, res, next) => {
    const { title, price } = req.body;

    if (!title || title.trim().length === 0 || !price || price <= 0) {
        return res.status(422).json({
            message: "Invalid input, please enter a valid title and price.",
        });
    }

    const products = await getProducts();

    const createdProduct = {
        id: uuid(),
        title,
        price,
    };

    products.push(createdProduct);
    await setProducts(products);

    res.status(201).json({
        message: "Created new product.",
        product: createdProduct,
    });
});

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
