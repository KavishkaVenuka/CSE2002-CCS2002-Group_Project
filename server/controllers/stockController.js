import Stock from "../models/Stock.js";

export const addProduct = async (req, res) => {
  try {
    const {
      item_name,
      description,
      category,
      brand,
      unit_of_measure,
      buying_price,
      selling_price,
    } = req.body;

    // Validation
    if (!item_name || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields: item_name and category",
      });
    }

    if (!buying_price || !selling_price) {
      return res.status(400).json({
        success: false,
        message: "Please provide buying_price and selling_price",
      });
    }
    const stockItem = await Stock.create({
      item_name,
      description,
      category,
      brand,
      unit_of_measure: unit_of_measure || "pcs",
      buying_price,
      selling_price,
    });
    
    res.status(201).json({
      success: true,
      message: "Stock item added successfully",
      data: {
        item_id: stockItem._id,
        ...stockItem._doc,
      },
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