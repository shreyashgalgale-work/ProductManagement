const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

const dataDir = path.join(__dirname, "data");
const productsFilePath = path.join(dataDir, "products.json");
const getProductsFromFile = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    if (!fs.existsSync(productsFilePath)) {
        fs.writeFileSync(productsFilePath, JSON.stricadangify([]));
    }

    const fileData = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(fileData);
};

const saveProductsToFile = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

app.use(bodyParser.json());

// CORS Headers => Required for cross-origin/ cross-server communication
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

app.get("/products", (req, res, next) => {
    const products = getProductsFromFile();
    res.status(200).json({ products });
});

app.post("/product", (req, res, next) => {
    const { title, price } = req.body;

    if (!title || title.trim().length === 0 || !price || price <= 0) {
        return res.status(422).json({
            message: "Invalid input, please enter a valid title and price.",
        });
    }

    const products = getProductsFromFile();

    const createdProduct = {
        id: uuid(),
        title,
        price,
    };

    products.push(createdProduct);
    saveProductsToFile(products);

    res.status(201).json({
        message: "Created new product.",
        product: createdProduct,
    });
});

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
}); // start Node + Express server on port 5000
