import fs from 'fs';
import path from 'path';

// Define the 116 endpoints based on the API reference
const endpoints = [
  // 1. Users / Auth
  { folder: "1. Users & Auth", id: 1, method: "POST", path: "/users/register", auth: "public", desc: "Register a new user", body: { fullName: "John Doe", email: "john@example.com", password: "Pass@123", role: "Customer", contactNumber: "0771234567", address: "Colombo" } },
  { folder: "1. Users & Auth", id: 2, method: "POST", path: "/users/login", auth: "public", desc: "Login — returns JWT token", body: { email: "admin@example.com", password: "Admin@123" } },
  { folder: "1. Users & Auth", id: 3, method: "GET", path: "/users/all-customers", auth: "protected", desc: "Get all customers list" },

  // 2. Admin Stock
  { folder: "2. Admin Stock", id: 4, method: "GET", path: "/admin/get-stock", auth: "admin", desc: "Get all admin stock items" },
  { folder: "2. Admin Stock", id: 5, method: "POST", path: "/admin/add-stock", auth: "admin", desc: "Add a new stock item", body: { name: "Item A", quantity: 100, unit: "kg", unitPrice: 250 } },
  { folder: "2. Admin Stock", id: 6, method: "PUT", path: "/admin/update-stock/:id", auth: "admin", desc: "Update a stock item by ID", body: { quantity: 150, unitPrice: 300 } },
  { folder: "2. Admin Stock", id: 7, method: "DELETE", path: "/admin/delete-stock/:id", auth: "admin", desc: "Delete a stock item by ID" },

  // 3. Stocks
  { folder: "3. Stock Items", id: 8, method: "GET", path: "/stocks/getItems", auth: "protected", desc: "Get all stock products" },
  { folder: "3. Stock Items", id: 9, method: "GET", path: "/stocks/getItems/:id", auth: "protected", desc: "Get one stock product by ID" },
  { folder: "3. Stock Items", id: 10, method: "POST", path: "/stocks/addItem", auth: "protected", desc: "Add a new stock item", body: { name: "Product A", quantity: 50, unit: "pcs", unitPrice: 100 } },
  { folder: "3. Stock Items", id: 11, method: "PUT", path: "/stocks/updateItem/:id", auth: "protected", desc: "Update stock item by ID", body: { quantity: 75 } },
  { folder: "3. Stock Items", id: 12, method: "DELETE", path: "/stocks/deleteItem/:id", auth: "protected", desc: "Delete stock item by ID" },

  // 4. Finance
  { folder: "4. Finance", id: 13, method: "GET", path: "/finance/getTransactions", auth: "protected", desc: "Get all finance transactions" },
  { folder: "4. Finance", id: 14, method: "GET", path: "/finance/getTransactions/:id", auth: "protected", desc: "Get transaction by ID" },
  { folder: "4. Finance", id: 15, method: "POST", path: "/finance/addTransaction", auth: "protected", desc: "Add a finance transaction", body: { transaction_type: "cash_in", amount: 5000, description: "Customer payment received", date: "2026-06-25", notes: "Invoice #001", bankAccountId: null, bankAccountName: null } },
  { folder: "4. Finance", id: 16, method: "PUT", path: "/finance/updateTransaction/:id", auth: "protected", desc: "Update transaction by ID", body: { transaction_type: "cash_in", amount: 5000, description: "Customer payment received", date: "2026-06-25", notes: "Invoice #001", bankAccountId: null, bankAccountName: null } },
  { folder: "4. Finance", id: 17, method: "DELETE", path: "/finance/deleteTransaction/:id", auth: "protected", desc: "Delete transaction by ID" },

  // 5. Bank Accounts
  { folder: "5. Bank Accounts", id: 18, method: "GET", path: "/bankAccounts/getBankAccounts", auth: "protected", desc: "Get all bank accounts" },
  { folder: "5. Bank Accounts", id: 19, method: "POST", path: "/bankAccounts/addBankAccount", auth: "protected", desc: "Add a bank account", body: { bankName: "Bank of Ceylon", accountNumber: "1234567890", opening_balance: 100000 } },
  { folder: "5. Bank Accounts", id: 20, method: "DELETE", path: "/bankAccounts/deleteBankAccount/:id", auth: "protected", desc: "Delete bank account by ID" },

  // 6. Payment Transactions
  { folder: "6. Payment Transactions", id: 21, method: "GET", path: "/paymentTransactions/getPayments", auth: "protected", desc: "Get all payments" },
  { folder: "6. Payment Transactions", id: 22, method: "POST", path: "/paymentTransactions/addPayment", auth: "protected", desc: "Add a payment transaction", body: { amount: 2500, type: "customer", paymentMethod: "cash", description: "Order payment" } },
  { folder: "6. Payment Transactions", id: 23, method: "DELETE", path: "/paymentTransactions/deletePayment/:id", auth: "protected", desc: "Delete payment by ID" },

  // 7. Requirements
  { folder: "7. Requirements", id: 24, method: "GET", path: "/requirements", auth: "protected", desc: "Get all requirements (filter by ?customerId=&status=&search=)" },
  { folder: "7. Requirements", id: 25, method: "GET", path: "/requirements/stats", auth: "protected", desc: "Get requirement statistics" },
  { folder: "7. Requirements", id: 26, method: "GET", path: "/requirements/:id", auth: "protected", desc: "Get single requirement by ID" },
  { folder: "7. Requirements", id: 27, method: "POST", path: "/requirements", auth: "protected", desc: "Create a new requirement (multipart/form-data)", isMultipart: true, body: { title: "Need Steel Rods", description: "50 units required urgently", customerId: "CUST000001", quantity: "50", unit: "pcs" } },
  { folder: "7. Requirements", id: 28, method: "PATCH", path: "/requirements/:id/status", auth: "protected", desc: "Update requirement status", body: { status: "Approved" } },

  // 8. Quotations
  { folder: "8. Quotations", id: 29, method: "GET", path: "/quotations/all", auth: "protected", desc: "Get all quotations (Admin)" },
  { folder: "8. Quotations", id: 30, method: "GET", path: "/quotations/pending-count/:email", auth: "protected", desc: "Pending quotation count for email" },
  { folder: "8. Quotations", id: 31, method: "GET", path: "/quotations/pending/:email", auth: "protected", desc: "Pending quotations by email" },
  { folder: "8. Quotations", id: 32, method: "GET", path: "/quotations/pending-customer/:email", auth: "protected", desc: "Pending quotations for customer" },
  { folder: "8. Quotations", id: 33, method: "GET", path: "/quotations/accepted-count", auth: "protected", desc: "Total accepted quotations count" },
  { folder: "8. Quotations", id: 34, method: "GET", path: "/quotations/rejected-count", auth: "protected", desc: "Total rejected quotations count" },
  { folder: "8. Quotations", id: 35, method: "GET", path: "/quotations/expired-count", auth: "protected", desc: "Total expired quotations count" },
  { folder: "8. Quotations", id: 36, method: "GET", path: "/quotations/customer/:customerId", auth: "protected", desc: "All quotations by customer ID" },
  { folder: "8. Quotations", id: 37, method: "PUT", path: "/quotations/reject/:id", auth: "protected", desc: "Reject a quotation", body: { reason: "Price too high" } },
  { folder: "8. Quotations", id: 38, method: "PUT", path: "/quotations/accept/:id", auth: "protected", desc: "Accept a quotation", body: { notes: "Approved" } },
  { folder: "8. Quotations", id: 39, method: "POST", path: "/quotations/create-supplier-quotation", auth: "protected", desc: "Create supplier quotation from requirement" },

  // 9. Orders
  { folder: "9. Orders", id: 40, method: "GET", path: "/orders", auth: "protected", desc: "Get all orders (Admin)" },
  { folder: "9. Orders", id: 41, method: "POST", path: "/orders", auth: "protected", desc: "Create a new order", body: { customerId: "CUST000001", items: [], totalAmount: 5000 } },
  { folder: "9. Orders", id: 42, method: "GET", path: "/orders/customer/:customerId", auth: "protected", desc: "Orders by customer ID" },
  { folder: "9. Orders", id: 43, method: "PUT", path: "/orders/:id/status", auth: "protected", desc: "Update order status", body: { status: "Processing" } },
  { folder: "9. Orders", id: 44, method: "PUT", path: "/orders/:id/issue-items", auth: "protected", desc: "Issue items for an order" },
  { folder: "9. Orders", id: 45, method: "PUT", path: "/orders/confirm-delivery/:id", auth: "protected", desc: "Confirm order delivery" },
  { folder: "9. Orders", id: 46, method: "PUT", path: "/orders/restock-rejected/:id", auth: "protected", desc: "Restock rejected order items" },
  { folder: "9. Orders", id: 47, method: "GET", path: "/orders/purchase-orders", auth: "protected", desc: "Get all purchase orders (Admin)" },
  { folder: "9. Orders", id: 48, method: "PUT", path: "/orders/purchase-orders/:id/status", auth: "protected", desc: "Update purchase order status", body: { status: "Approved" } },
  { folder: "9. Orders", id: 49, method: "GET", path: "/orders/pending-count/:customerId", auth: "protected", desc: "Pending count for customer" },
  { folder: "9. Orders", id: 50, method: "GET", path: "/orders/processing-count/:customerId", auth: "protected", desc: "Processing count for customer" },
  { folder: "9. Orders", id: 51, method: "GET", path: "/orders/dispatched-count/:customerId", auth: "protected", desc: "Dispatched count for customer" },
  { folder: "9. Orders", id: 52, method: "GET", path: "/orders/in-transit-count/:customerId", auth: "protected", desc: "In-transit count for customer" },
  { folder: "9. Orders", id: 53, method: "GET", path: "/orders/delivered-count/:customerId", auth: "protected", desc: "Delivered count for customer" },

  // 10. Invoices
  { folder: "10. Invoices (Customer)", id: 54, method: "GET", path: "/invoices/paid-count/:email", auth: "protected", desc: "Paid invoice count for customer" },
  { folder: "10. Invoices (Customer)", id: 55, method: "GET", path: "/invoices/unpaid-count/:email", auth: "protected", desc: "Unpaid invoice count for customer" },
  { folder: "10. Invoices (Customer)", id: 56, method: "GET", path: "/invoices/overdue-count/:email", auth: "protected", desc: "Overdue invoice count for customer" },
  { folder: "10. Invoices (Customer)", id: 57, method: "GET", path: "/invoices/customer/:email", auth: "protected", desc: "All invoices for a customer" },
  { folder: "10. Invoices (Customer)", id: 58, method: "POST", path: "/invoices/:invoiceID/payment", auth: "protected", desc: "Submit payment for an invoice (multipart/form-data)", isMultipart: true, body: { amount: "2500", paymentMethod: "bank" } },

  // 11. Suppliers
  { folder: "11. Suppliers — Requirements", id: 59, method: "GET", path: "/suppliers/all", auth: "admin", desc: "Get all suppliers (Admin)" },
  { folder: "11. Suppliers — Requirements", id: 60, method: "GET", path: "/suppliers/supplier-requirements/my", auth: "protected", desc: "Get my supplier requirements" },
  { folder: "11. Suppliers — Requirements", id: 61, method: "POST", path: "/suppliers/supplier-requirements", auth: "admin", desc: "Create a supplier requirement", body: { title: "Raw Lumber", description: "Looking for wood suppliers", quantity: 50, unit: "pcs" } },
  { folder: "11. Suppliers — Requirements", id: 62, method: "GET", path: "/suppliers/requirements/stats", auth: "protected", desc: "Get supplier requirement stats" },
  { folder: "11. Suppliers — Requirements", id: 63, method: "GET", path: "/suppliers/requirements/:id", auth: "protected", desc: "Get supplier requirement by ID" },
  { folder: "11. Suppliers — Requirements", id: 64, method: "GET", path: "/suppliers/dashboard/stats", auth: "protected", desc: "Supplier dashboard stats" },
  { folder: "11. Suppliers — Requirements", id: 65, method: "GET", path: "/suppliers/dashboard/recent-requirements", auth: "protected", desc: "Recent supplier requirements" },
  { folder: "11. Suppliers — Requirements", id: 66, method: "GET", path: "/suppliers/dashboard/recent-orders", auth: "protected", desc: "Recent supplier orders" },
  { folder: "11. Suppliers — Requirements", id: 67, method: "GET", path: "/suppliers/dashboard/pending-payments", auth: "protected", desc: "Supplier pending payments" },

  // 12. Supplier Quotations
  { folder: "12. Supplier Quotations", id: 68, method: "GET", path: "/suppliers/quotations", auth: "protected", desc: "Get quotations (for supplier's own)" },
  { folder: "12. Supplier Quotations", id: 69, method: "GET", path: "/suppliers/quotations/table", auth: "protected", desc: "Same as above (frontend alias)" },
  { folder: "12. Supplier Quotations", id: 70, method: "GET", path: "/suppliers/quotations/stats", auth: "protected", desc: "Quotation statistics" },
  { folder: "12. Supplier Quotations", id: 71, method: "GET", path: "/suppliers/quotations/all", auth: "protected", desc: "All quotations (Admin view)" },
  { folder: "12. Supplier Quotations", id: 72, method: "GET", path: "/suppliers/quotations/:id", auth: "protected", desc: "Get quotation by ID" },
  { folder: "12. Supplier Quotations", id: 73, method: "GET", path: "/suppliers/quotations/:id/detail", auth: "protected", desc: "Get quotation detail by ID" },
  { folder: "12. Supplier Quotations", id: 74, method: "POST", path: "/suppliers/quotations", auth: "protected", desc: "Create a supplier quotation", body: { requirementId: "REQ001", price: 1500, notes: "Best price guaranteed", validUntil: "2026-07-01" } },
  { folder: "12. Supplier Quotations", id: 75, method: "PATCH", path: "/suppliers/quotations/:id", auth: "protected", desc: "Update a quotation", body: { price: 1700, notes: "Updated" } },
  { folder: "12. Supplier Quotations", id: 76, method: "POST", path: "/suppliers/quotations/:id/submit", auth: "protected", desc: "Submit a draft quotation" },
  { folder: "12. Supplier Quotations", id: 77, method: "PUT", path: "/suppliers/quotations/accept/:id", auth: "admin", desc: "Admin: Accept a supplier quotation" },
  { folder: "12. Supplier Quotations", id: 78, method: "PUT", path: "/suppliers/quotations/reject/:id", auth: "admin", desc: "Admin: Reject a supplier quotation" },

  // 13. Supplier Orders
  { folder: "13. Supplier Orders", id: 79, method: "GET", path: "/supplier-orders", auth: "protected", desc: "Get all supplier orders (Admin)" },
  { folder: "13. Supplier Orders", id: 80, method: "GET", path: "/supplier-orders/my-orders", auth: "protected", desc: "Supplier's own orders" },
  { folder: "13. Supplier Orders", id: 81, method: "GET", path: "/supplier-orders/my-invoices", auth: "protected", desc: "Supplier's own invoices" },
  { folder: "13. Supplier Orders", id: 82, method: "GET", path: "/supplier-orders/my-pending-count", auth: "protected", desc: "Supplier pending orders count" },
  { folder: "13. Supplier Orders", id: 83, method: "GET", path: "/supplier-orders/my-active-count", auth: "protected", desc: "Supplier active orders count" },
  { folder: "13. Supplier Orders", id: 84, method: "GET", path: "/supplier-orders/my-delivered-count", auth: "protected", desc: "Supplier delivered orders count" },
  { folder: "13. Supplier Orders", id: 85, method: "GET", path: "/supplier-orders/my-stats", auth: "protected", desc: "Supplier order stats" },
  { folder: "13. Supplier Orders", id: 86, method: "GET", path: "/supplier-orders/dispatch-list", auth: "protected", desc: "Orders ready to dispatch" },
  { folder: "13. Supplier Orders", id: 87, method: "GET", path: "/supplier-orders/invoiceable-orders", auth: "protected", desc: "Orders eligible for invoice" },
  { folder: "13. Supplier Orders", id: 88, method: "GET", path: "/supplier-orders/invoices", auth: "protected", desc: "All supplier invoices (Admin)" },
  { folder: "13. Supplier Orders", id: 89, method: "GET", path: "/supplier-orders/:id", auth: "protected", desc: "Get supplier order by ID" },
  { folder: "13. Supplier Orders", id: 90, method: "GET", path: "/supplier-orders/:id/delivery-progress", auth: "protected", desc: "Delivery progress for an order" },
  { folder: "13. Supplier Orders", id: 91, method: "GET", path: "/supplier-orders/supplier/:supplierId", auth: "protected", desc: "Orders by supplier ID (Admin)" },
  { folder: "13. Supplier Orders", id: 92, method: "PUT", path: "/supplier-orders/:id/status", auth: "protected", desc: "Update supplier order status", body: { status: "Processing" } },
  { folder: "13. Supplier Orders", id: 93, method: "PUT", path: "/supplier-orders/:id/dispatch", auth: "protected", desc: "Dispatch a supplier order" },
  { folder: "13. Supplier Orders", id: 94, method: "PUT", path: "/supplier-orders/:id/confirm-delivery", auth: "protected", desc: "Confirm supplier delivery" },
  { folder: "13. Supplier Orders", id: 95, method: "PUT", path: "/supplier-orders/invoices/:id/accept", auth: "protected", desc: "Accept supplier payment" },
  { folder: "13. Supplier Orders", id: 96, method: "PUT", path: "/supplier-orders/invoices/:id/reject", auth: "protected", desc: "Reject supplier payment" },
  { folder: "13. Supplier Orders", id: 97, method: "POST", path: "/supplier-orders/:orderId/create-invoice", auth: "protected", desc: "Create invoice for supplier order", body: { amount: 5000, dueDate: "2026-07-10" } },
  { folder: "13. Supplier Orders", id: 98, method: "PATCH", path: "/supplier-orders/:id/acknowledge", auth: "protected", desc: "Supplier acknowledges order" },

  // 14. Supplier Invoices
  { folder: "14. Supplier Invoices", id: 99, method: "GET", path: "/supplier-invoices", auth: "protected", desc: "All supplier invoices (Admin)" },
  { folder: "14. Supplier Invoices", id: 100, method: "GET", path: "/supplier-invoices/my", auth: "protected", desc: "My supplier invoices" },
  { folder: "14. Supplier Invoices", id: 101, method: "GET", path: "/supplier-invoices/all", auth: "protected", desc: "All my invoices (frontend alias)" },
  { folder: "14. Supplier Invoices", id: 102, method: "GET", path: "/supplier-invoices/stats", auth: "protected", desc: "Supplier invoice stats" },
  { folder: "14. Supplier Invoices", id: 103, method: "GET", path: "/supplier-invoices/paid-count/:email", auth: "protected", desc: "Paid invoice count by email" },
  { folder: "14. Supplier Invoices", id: 104, method: "GET", path: "/supplier-invoices/unpaid-count/:email", auth: "protected", desc: "Unpaid invoice count by email" },
  { folder: "14. Supplier Invoices", id: 105, method: "GET", path: "/supplier-invoices/overdue-count/:email", auth: "protected", desc: "Overdue invoice count by email" },
  { folder: "14. Supplier Invoices", id: 106, method: "POST", path: "/supplier-invoices", auth: "protected", desc: "Supplier creates an invoice", body: { orderId: "ORD123", amount: 5000, dueDate: "2026-07-10" } },
  { folder: "14. Supplier Invoices", id: 107, method: "POST", path: "/supplier-invoices/:invoiceID/payment", auth: "protected", desc: "Submit payment proof for invoice (multipart/form-data)", isMultipart: true, body: { amount: "5000" } },
  { folder: "14. Supplier Invoices", id: 108, method: "PUT", path: "/supplier-invoices/accept-payment/:id", auth: "protected", desc: "Admin accepts payment" },
  { folder: "14. Supplier Invoices", id: 109, method: "PUT", path: "/supplier-invoices/reject-payment/:id", auth: "protected", desc: "Admin rejects payment" },

  // 15. Supplier Payments
  { folder: "15. Supplier Payments", id: 110, method: "GET", path: "/supplier-payments", auth: "protected", desc: "Get all supplier payments" },
  { folder: "15. Supplier Payments", id: 111, method: "GET", path: "/supplier-payments/all", auth: "protected", desc: "My supplier payments (frontend alias)" },
  { folder: "15. Supplier Payments", id: 112, method: "GET", path: "/supplier-payments/stats", auth: "protected", desc: "Supplier payment stats" },
  { folder: "15. Supplier Payments", id: 113, method: "POST", path: "/supplier-payments", auth: "protected", desc: "Add a supplier payment", body: { invoiceId: "INV123", amount: 3000, paymentMethod: "bank" } },
  { folder: "15. Supplier Payments", id: 114, method: "DELETE", path: "/supplier-payments/:id", auth: "protected", desc: "Delete a supplier payment" },

  // 16. Dashboard
  { folder: "16. Dashboard", id: 115, method: "GET", path: "/dashboard/admin-stats", auth: "protected", desc: "Admin dashboard statistics" },
  { folder: "16. Dashboard", id: 116, method: "GET", path: "/dashboard/customer-stats", auth: "protected", desc: "Customer dashboard statistics" }
];

// Helper to convert parameters to Postman style
function formatUrl(urlPath) {
  const parts = urlPath.split('/').filter(Boolean);
  const host = ["{{baseUrl}}"];
  return {
    raw: "{{baseUrl}}" + urlPath,
    host: host,
    path: parts.map(p => p.startsWith(':') ? p : p)
  };
}

function buildCollection() {
  const folders = {};

  endpoints.forEach(ep => {
    if (!folders[ep.folder]) {
      folders[ep.folder] = [];
    }

    const request = {
      method: ep.method,
      header: [],
      url: formatUrl(ep.path),
      description: ep.desc
    };

    // Auth config
    if (ep.auth !== 'public') {
      request.auth = {
        type: "bearer",
        bearer: [
          {
            key: "token",
            value: "{{token}}",
            type: "string"
          }
        ]
      };
    }

    // Body config
    if (ep.body) {
      if (ep.isMultipart) {
        request.body = {
          mode: "formdata",
          formdata: Object.entries(ep.body).map(([key, val]) => ({
            key: key,
            value: val,
            type: "text"
          }))
        };
      } else {
        request.header.push({
          key: "Content-Type",
          value: "application/json"
        });
        request.body = {
          mode: "raw",
          raw: JSON.stringify(ep.body, null, 2)
        };
      }
    }

    // Setup automatically capturing Token from User Login
    const event = [];
    if (ep.id === 2) {
      event.push({
        listen: "test",
        script: {
          exec: [
            "const responseData = pm.response.json();",
            "if (responseData.token) {",
            "    pm.environment.set(\"token\", responseData.token);",
            "    console.log(\"Automatically saved JWT Token to environment: token\");",
            "}",
            "pm.test(\"Login successful\", function () {",
            "    pm.response.to.have.status(200);",
            "});"
          ],
          type: "text/javascript"
        }
      });
    }

    folders[ep.folder].push({
      name: `[#${ep.id}] ${ep.method} ${ep.path}`,
      event: event,
      request: request,
      response: []
    });
  });

  const collectionItems = Object.entries(folders).map(([folderName, items]) => {
    return {
      name: folderName,
      item: items
    };
  });

  const collection = {
    info: {
      _postman_id: "c85d88ab-8c9e-4e4b-97fa-ea2945d8b87a",
      name: "CSE2002 Complete API Collection (116 Endpoints)",
      description: "Automatically generated test suite covering all 116 routes defined in the API Reference document.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: collectionItems
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'api_test_collection.postman_collection.json'),
    JSON.stringify(collection, null, 2)
  );
  console.log("Successfully generated api_test_collection.postman_collection.json with 116 endpoints!");
}

buildCollection();
