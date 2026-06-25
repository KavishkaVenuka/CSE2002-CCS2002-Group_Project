import StockItem from "../models/Stock.js";

// ================================
//   STOCK MANAGEMENT (Admin Only)
// ================================

export async function addStock(req, res) {
    try {
        const newStock = new StockItem(req.body);
        await newStock.save();
        res.status(201).json({ message: "Stock item added successfully", stock: newStock });
    } catch (error) {
        res.status(500).json({ message: "Error adding stock item", error: error.message });
    }
}

export async function updateStock(req, res) {
    try {
        const { id } = req.params;
        const updatedStock = await StockItem.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStock) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json({ message: "Stock item updated successfully", stock: updatedStock });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock item", error: error.message });
    }
}

export async function deleteStock(req, res) {
    try {
        const { id } = req.params;
        const deletedStock = await StockItem.findByIdAndDelete(id);
        if (!deletedStock) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json({ message: "Stock item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting stock item", error: error.message });
    }
}

export async function getAllStock(req, res) {
    try {
        const stock = await StockItem.find();
        res.status(200).json({ success: true, stock });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock", error: error.message });
    }
}