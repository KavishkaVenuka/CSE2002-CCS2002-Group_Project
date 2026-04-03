import Stock from "../models/Stock.js";

// CREATE
export const addProduct = async (req, res) => {
  try {
    const {
      item_name,
      description,
      category,
      brand,
      quantity,
      min_quantity,
      warehouse_location,
      unit_of_measure,
      buying_price,
      selling_price,
      discontinued,
    } = req.body;

    if (!item_name || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields: item_name and category",
      });
    }

    if (buying_price === undefined || selling_price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide buying_price and selling_price",
      });
    }

    const stockItem = await Stock.create({
      item_name,
      description: description || "",
      category,
      brand: brand || "",
      quantity: quantity || 0,
      min_quantity: min_quantity || 0,
      warehouse_location: warehouse_location || "N/A",
      unit_of_measure: unit_of_measure || "pcs",
      buying_price,
      selling_price,
      discontinued: discontinued || false,
    });

    res.status(201).json({
      success: true,
      message: "Stock item added successfully",
      data: stockItem,
    });
  } catch (error) {
    console.error("Error adding stock item:", error);
    res.status(500).json({
      success: false,
      message: "Error adding stock item",
      error: error.message,
    });
  }
};

// GET ALL
export const getAllProducts = async (req, res) => {
  try {
    const stockItems = await Stock.find().sort({ createdAt: -1 });

    const formattedItems = stockItems.map((item) => ({
      ...item.toObject(),
      buying_price: Number(item.buying_price?.toString() || 0),
      selling_price: Number(item.selling_price?.toString() || 0),
    }));

    res.status(200).json({
      success: true,
      count: formattedItems.length,
      data: formattedItems,
    });
  } catch (error) {
    console.error("Error fetching stock items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock items",
      error: error.message,
    });
  }
};

// GET ONE
export const getProductById = async (req, res) => {
  try {
    const stockItem = await Stock.findById(req.params.id);

    if (!stockItem) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    const formattedItem = {
      ...stockItem.toObject(),
      buying_price: Number(stockItem.buying_price?.toString() || 0),
      selling_price: Number(stockItem.selling_price?.toString() || 0),
    };

    res.status(200).json({
      success: true,
      data: formattedItem,
    });
  } catch (error) {
    console.error("Error fetching stock item:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock item",
      error: error.message,
    });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const {
      item_name,
      description,
      category,
      brand,
      quantity,
      min_quantity,
      warehouse_location,
      unit_of_measure,
      buying_price,
      selling_price,
      discontinued,
    } = req.body;

    const updatedItem = await Stock.findByIdAndUpdate(
      req.params.id,
      {
        item_name,
        description,
        category,
        brand,
        quantity,
        min_quantity,
        warehouse_location,
        unit_of_measure,
        buying_price,
        selling_price,
        discontinued,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating stock item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating stock item",
      error: error.message,
    });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const deletedItem = await Stock.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting stock item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting stock item",
      error: error.message,
    });
  }
};