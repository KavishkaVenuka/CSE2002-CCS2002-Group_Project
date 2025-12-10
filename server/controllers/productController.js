import Product from "../models/Product.js";

export function createProduct(req, res) {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }

    // Check if productID is provided
    if (!req.body.productID) {
        res.status(400).json({
            message: "productID is required",
        });
        return;
    }

    const product = new Product(req.body);

    product
        .save()
        .then(() => {
            res.json({
                message: "Product created successfully",
            });
        })
        .catch((error) => {
            next(error);
        });
}

export function getAllProducts(req, res) {
    if (req.user && req.user.role === "admin") {
        Product.find()
            .then((products) => {
                res.json(products);
            })
            .catch((error) => next(error));
    } else {
        Product.find({ isAvailable: true })
            .then((products) => {
                res.json(products);
            })
            .catch((error) => next(error));
    }
}

export function deleteProduct(req, res) {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({
            message: "Only admin can delete products"
        });
        return;
    }

    const productID = req.params.productID

    Product.deleteOne({ productID: productID })
        .then((result) => {
            if (result.deletedCount === 0) {
                res.status(404).json({
                    message: "Product not found"
                });
            } else {
                res.json({
                    message: "Product deleted successfully"
                });
            }
        })
        .catch((error) => next(error));
}

export function updateProduct(req, res) {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({
            message: "Only admin can update products"
        });
        return;
    }

    const productID = req.params.productID;

    Product.updateOne({ productID: productID }, req.body)
        .then((result) => {
            if (result.matchedCount === 0) {
                res.status(404).json({
                    message: "Product not found"
                });
            } else {
                res.json({
                    message: "Product updated successfully"
                });
            }
        })
        .catch((error) => next(error));
}

export function getProductByID(req, res) {
    const productID = req.params.productID;

    Product.findOne({ productID: productID })
        .then((product) => {
            if (product == null) {
                res.status(404).json({
                    message: "Product not found"
                });
            } else {
                if (product.isAvailable) {
                    res.json(product);
                } else {
                    if (isAdmin(req)) {
                        res.json(product);
                    } else {
                        res.status(404).json({
                            message: "Product not found"
                        });
                    }
                }
            }
        })
        .catch((error) => next(error));
}