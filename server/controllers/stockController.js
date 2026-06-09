import Stock from "../models/Stock.js";
import XLSX from "xlsx";
import { generateStockTemplate } from "../utils/excelTemplate.js";
import fs from "fs";

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

// EXCEL UPLOAD
export const uploadStocksExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const items = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Map Excel headers to DB fields
      const itemName = row["Item Name*"] || row["Item Name"];
      const category = row["Category*"] || row["Category"];
      const buyingPrice = row["Buying Price*"] || row["Buying Price"];
      const sellingPrice = row["Selling Price*"] || row["Selling Price"];

      if (!itemName || !category || buyingPrice === undefined || sellingPrice === undefined) {
        errors.push(`Row ${i + 2}: Missing required fields (Item Name, Category, Buying Price, or Selling Price)`);
        continue;
      }

      items.push({
        item_name: itemName,
        category: category,
        brand: row["Brand"] || "",
        description: row["Description"] || "",
        unit_of_measure: row["Unit*"] || row["Unit"] || "pcs",
        buying_price: buyingPrice,
        selling_price: sellingPrice,
        quantity: row["Quantity"] || 0,
        min_quantity: row["Min Quantity"] || 0,
        warehouse_location: row["Location"] || "N/A",
      });
    }

    if (items.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: "No valid data found in the Excel file", 
        errors 
      });
    }

    // Bulk insert
    const result = await Stock.insertMany(items);

    // Delete temp file
    if (req.file) fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${result.length} items`,
      count: result.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Excel Upload Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Error processing Excel file",
      error: error.message,
    });
  }
};

// DOWNLOAD TEMPLATE
export const downloadStockTemplate = async (req, res) => {
  try {
    const buffer = generateStockTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=stock_template.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating template" });
  }
};
