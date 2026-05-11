import mongoose from "mongoose";

const stockItemSchema = new mongoose.Schema(
  {
    
    item_name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    unit_of_measure: {
      type: String,
      required: true,
      trim: true,
      default: "pcs",
    },

    buying_price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    selling_price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },

    min_quantity: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },

    warehouse_location: {
      type: String,
      trim: true,
      default: null,
    },

    is_discontinued: {
      type: Boolean,
      default: false,
    },

    // Supplier who provides this stock item
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    supplierEmail: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { 
    timestamps: true 
  }
);

// Virtual to check if reorder is needed
stockItemSchema.virtual("needs_reorder").get(function () {
  return this.quantity_on_hand <= this.min_stock_level;
});

// Ensure virtuals are included in JSON output
stockItemSchema.set("toJSON", { virtuals: true });
stockItemSchema.set("toObject", { virtuals: true });

const StockItem = mongoose.model("StockItem", stockItemSchema);

export default StockItem;