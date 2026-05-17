import XLSX from 'xlsx';

export const generateStockTemplate = () => {
    const data = [
        {
            "Item Name*": "Example Product",
            "Category*": "Electronics",
            "Brand": "Sony",
            "Description": "High quality wireless headphones",
            "Unit*": "pcs",
            "Buying Price*": 5000,
            "Selling Price*": 7500,
            "Quantity": 50,
            "Min Quantity": 10,
            "Location": "Shelf A1"
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Template");

    // Returns a buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
