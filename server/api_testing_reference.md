# 📬 Postman API Testing Reference
**Base URL:** `http://localhost:5900`  
**Server Port:** `5900`

---

## 🔑 Authentication Setup

> [!IMPORTANT]
> For all **Protected** routes, add this header in Postman:
> - **Key:** `Authorization`
> - **Value:** `Bearer <your_token>`
>
> Get the token from the **Login** endpoint response.

**How to set it up in Postman:**
1. Login → copy the `token` from response
2. In every protected request → **Headers tab** → add `Authorization: Bearer <token>`

**OR** use a Postman Environment Variable:
- Create variable: `token` = (paste your token)
- Use `{{token}}` in headers → `Authorization: Bearer {{token}}`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🟢 | Public — No token needed |
| 🔴 | Protected — Token required (`verifyToken`) |
| 👑 | Admin only (`requireAdmin`) |
| 👤 | Any logged-in user (`requireAuth`) |

---

## 1. 👤 Users / Auth — `/api/users`

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 1 | POST | `/api/users/register` | 🟢 Public | Register a new user | `{ "fullName": "John Doe", "email": "john@example.com", "password": "Pass@123", "role": "Customer", "contactNumber": "0771234567", "address": "Colombo" }` |
| 2 | POST | `/api/users/login` | 🟢 Public | Login — returns JWT token | `{ "email": "admin@example.com", "password": "Admin@123" }` |
| 3 | GET | `/api/users/all-customers` | 🔴👤 | Get all customers list | — |

> **Role values:** `"Admin"` · `"Customer"` · `"Supplier"`  
> **Generated IDs:** Admin → `ADM000001`, Customer → `CUST000001`, Supplier → `SUP000001`

---

## 2. 👑 Admin — Stock Management — `/api/admin`

> All routes require Admin token (`requireAdmin`)

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 4 | GET | `/api/admin/get-stock` | 🔴👑 | Get all admin stock items | — |
| 5 | POST | `/api/admin/add-stock` | 🔴👑 | Add a new stock item | `{ "name": "Item A", "quantity": 100, "unit": "kg", "unitPrice": 250 }` |
| 6 | PUT | `/api/admin/update-stock/:id` | 🔴👑 | Update a stock item by ID | `{ "quantity": 150, "unitPrice": 300 }` |
| 7 | DELETE | `/api/admin/delete-stock/:id` | 🔴👑 | Delete a stock item by ID | — |

---

## 3. 📦 Stock Items — `/api/stocks`

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 8 | GET | `/api/stocks/getItems` | 🔴 | Get all stock products | — |
| 9 | GET | `/api/stocks/getItems/:id` | 🔴 | Get one stock product by ID | — |
| 10 | POST | `/api/stocks/addItem` | 🔴 | Add a new stock item | `{ "name": "Product A", "quantity": 50, "unit": "pcs", "unitPrice": 100 }` |
| 11 | PUT | `/api/stocks/updateItem/:id` | 🔴 | Update stock item by ID | `{ "quantity": 75 }` |
| 12 | DELETE | `/api/stocks/deleteItem/:id` | 🔴 | Delete stock item by ID | — |

---

## 4. 💰 Finance — Transactions — `/api/finance`

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 13 | GET | `/api/finance/getTransactions` | 🔴 | Get all finance transactions | — |
| 14 | GET | `/api/finance/getTransactions/:id` | 🔴 | Get transaction by ID | — |
| 15 | POST | `/api/finance/addTransaction` | 🔴 | Add a finance transaction | See below ↓ |
| 16 | PUT | `/api/finance/updateTransaction/:id` | 🔴 | Update transaction by ID | Same fields as POST |
| 17 | DELETE | `/api/finance/deleteTransaction/:id` | 🔴 | Delete transaction by ID | — |

**POST `/api/finance/addTransaction` Body:**
```json
{
  "transaction_type": "cash_in",
  "amount": 5000,
  "description": "Customer payment received",
  "date": "2026-06-25",
  "notes": "Invoice #001",
  "bankAccountId": null,
  "bankAccountName": null
}
```
> `transaction_type` values: `"cash_in"` · `"cash_out"` · `"bank_deposit"` · `"bank_withdraw"`

---

## 5. 🏦 Bank Accounts — `/api/bankAccounts`

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 18 | GET | `/api/bankAccounts/getBankAccounts` | 🔴 | Get all bank accounts | — |
| 19 | POST | `/api/bankAccounts/addBankAccount` | 🔴 | Add a bank account | `{ "bankName": "Bank of Ceylon", "accountNumber": "1234567890", "opening_balance": 100000 }` |
| 20 | DELETE | `/api/bankAccounts/deleteBankAccount/:id` | 🔴 | Delete bank account by ID | — |

---

## 6. 💳 Payment Transactions — `/api/paymentTransactions`

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 21 | GET | `/api/paymentTransactions/getPayments` | 🔴 | Get all payments | — |
| 22 | POST | `/api/paymentTransactions/addPayment` | 🔴 | Add a payment transaction | `{ "amount": 2500, "type": "customer", "paymentMethod": "cash", "description": "Order payment" }` |
| 23 | DELETE | `/api/paymentTransactions/deletePayment/:id` | 🔴 | Delete payment by ID | — |

---

## 7. 📋 Requirements — `/api/requirements`

| # | Method | Endpoint | Auth | Description | Request Body |
|---|--------|----------|------|-------------|--------------|
| 24 | GET | `/api/requirements` | 🔴 | Get all requirements (filter by `?customerId=&status=&search=`) | — |
| 25 | GET | `/api/requirements/stats` | 🔴 | Get requirement statistics | — |
| 26 | GET | `/api/requirements/:id` | 🔴 | Get single requirement by ID | — |
| 27 | POST | `/api/requirements` | 🔴 | Create a new requirement | `multipart/form-data` — See below ↓ |
| 28 | PATCH | `/api/requirements/:id/status` | 🔴 | Update requirement status | `{ "status": "Approved" }` |

**POST `/api/requirements` (multipart/form-data):**
```
title         = "Need Steel Rods"
description   = "50 units required urgently"
customerId    = "CUST000001"
quantity      = 50
unit          = "pcs"
attachedDocument = (file upload — optional)
```

---

## 8. 📄 Quotations — `/api/quotations`

| # | Method | Endpoint | Auth | Description | Query/Params |
|---|--------|----------|------|-------------|--------------|
| 29 | GET | `/api/quotations/all` | 🔴 | Get all quotations (Admin) | — |
| 30 | GET | `/api/quotations/pending-count/:email` | 🔴 | Pending quotation count for email | `:email` |
| 31 | GET | `/api/quotations/pending/:email` | 🔴 | Pending quotations by email | `:email` |
| 32 | GET | `/api/quotations/pending-customer/:email` | 🔴 | Pending quotations for customer | `:email` |
| 33 | GET | `/api/quotations/accepted-count` | 🔴 | Total accepted quotations count | — |
| 34 | GET | `/api/quotations/rejected-count` | 🔴 | Total rejected quotations count | — |
| 35 | GET | `/api/quotations/expired-count` | 🔴 | Total expired quotations count | — |
| 36 | GET | `/api/quotations/customer/:customerId` | 🔴 | All quotations by customer ID | `:customerId` |
| 37 | PUT | `/api/quotations/reject/:id` | 🔴 | Reject a quotation | `{ "reason": "Price too high" }` |
| 38 | PUT | `/api/quotations/accept/:id` | 🔴 | Accept a quotation | `{ "notes": "Approved" }` |
| 39 | POST | `/api/quotations/create-supplier-quotation` | 🔴 | Create supplier quotation from requirement | See quotationController |

---

## 9. 📦 Orders — `/api/orders`

| # | Method | Endpoint | Auth | Description | Body / Params |
|---|--------|----------|------|-------------|--------------|
| 40 | GET | `/api/orders` | 🔴 | Get all orders (Admin) | — |
| 41 | POST | `/api/orders` | 🔴 | Create a new order | `{ "customerId": "CUST000001", "items": [...], "totalAmount": 5000 }` |
| 42 | GET | `/api/orders/customer/:customerId` | 🔴 | Orders by customer ID | `:customerId` |
| 43 | PUT | `/api/orders/:id/status` | 🔴 | Update order status | `{ "status": "Processing" }` |
| 44 | PUT | `/api/orders/:id/issue-items` | 🔴 | Issue items for an order | — |
| 45 | PUT | `/api/orders/confirm-delivery/:id` | 🔴 | Confirm order delivery | — |
| 46 | PUT | `/api/orders/restock-rejected/:id` | 🔴 | Restock rejected order items | — |
| 47 | GET | `/api/orders/purchase-orders` | 🔴 | Get all purchase orders (Admin) | — |
| 48 | PUT | `/api/orders/purchase-orders/:id/status` | 🔴 | Update purchase order status | `{ "status": "Approved" }` |
| 49 | GET | `/api/orders/pending-count/:customerId` | 🔴 | Pending count for customer | `:customerId` |
| 50 | GET | `/api/orders/processing-count/:customerId` | 🔴 | Processing count for customer | `:customerId` |
| 51 | GET | `/api/orders/dispatched-count/:customerId` | 🔴 | Dispatched count for customer | `:customerId` |
| 52 | GET | `/api/orders/in-transit-count/:customerId` | 🔴 | In-transit count for customer | `:customerId` |
| 53 | GET | `/api/orders/delivered-count/:customerId` | 🔴 | Delivered count for customer | `:customerId` |

---

## 10. 🧾 Invoices (Customer) — `/api/invoices`

| # | Method | Endpoint | Auth | Description | Body |
|---|--------|----------|------|-------------|------|
| 54 | GET | `/api/invoices/paid-count/:email` | 🔴 | Paid invoice count for customer | `:email` |
| 55 | GET | `/api/invoices/unpaid-count/:email` | 🔴 | Unpaid invoice count for customer | `:email` |
| 56 | GET | `/api/invoices/overdue-count/:email` | 🔴 | Overdue invoice count for customer | `:email` |
| 57 | GET | `/api/invoices/customer/:email` | 🔴 | All invoices for a customer | `:email` |
| 58 | POST | `/api/invoices/:invoiceID/payment` | 🔴 | Submit payment for an invoice | `multipart/form-data`: `amount`, `paymentMethod`, `paymentProof` (file) |

---

## 11. 🏭 Suppliers — Requirements — `/api/suppliers`

| # | Method | Endpoint | Auth | Description | Body |
|---|--------|----------|------|-------------|------|
| 59 | GET | `/api/suppliers/all` | 🔴👑 | Get all suppliers (Admin) | — |
| 60 | GET | `/api/suppliers/supplier-requirements/my` | 🔴👤 | Get my supplier requirements | — |
| 61 | POST | `/api/suppliers/supplier-requirements` | 🔴👑 | Create a supplier requirement | `{ "title": "...", "description": "...", "quantity": 50, "unit": "pcs" }` |
| 62 | GET | `/api/suppliers/requirements/stats` | 🔴 | Get supplier requirement stats | — |
| 63 | GET | `/api/suppliers/requirements/:id` | 🔴 | Get supplier requirement by ID | — |
| 64 | GET | `/api/suppliers/dashboard/stats` | 🔴👤 | Supplier dashboard stats | — |
| 65 | GET | `/api/suppliers/dashboard/recent-requirements` | 🔴👤 | Recent supplier requirements | — |
| 66 | GET | `/api/suppliers/dashboard/recent-orders` | 🔴👤 | Recent supplier orders | — |
| 67 | GET | `/api/suppliers/dashboard/pending-payments` | 🔴👤 | Supplier pending payments | — |

---

## 12. 📝 Supplier Quotations — `/api/suppliers/quotations`

| # | Method | Endpoint | Auth | Description | Body |
|---|--------|----------|------|-------------|------|
| 68 | GET | `/api/suppliers/quotations` | 🔴 | Get quotations (for supplier's own) | — |
| 69 | GET | `/api/suppliers/quotations/table` | 🔴 | Same as above (frontend alias) | — |
| 70 | GET | `/api/suppliers/quotations/stats` | 🔴 | Quotation statistics | — |
| 71 | GET | `/api/suppliers/quotations/all` | 🔴 | All quotations (Admin view) | — |
| 72 | GET | `/api/suppliers/quotations/:id` | 🔴 | Get quotation by ID | — |
| 73 | GET | `/api/suppliers/quotations/:id/detail` | 🔴 | Get quotation detail by ID | — |
| 74 | POST | `/api/suppliers/quotations` | 🔴 | Create a supplier quotation | `{ "requirementId": "...", "price": 1500, "notes": "...", "validUntil": "2026-07-01" }` |
| 75 | PATCH | `/api/suppliers/quotations/:id` | 🔴 | Update a quotation | `{ "price": 1700, "notes": "Updated" }` |
| 76 | POST | `/api/suppliers/quotations/:id/submit` | 🔴 | Submit a draft quotation | — |
| 77 | PUT | `/api/suppliers/quotations/accept/:id` | 🔴👑 | Admin: Accept a supplier quotation | — |
| 78 | PUT | `/api/suppliers/quotations/reject/:id` | 🔴👑 | Admin: Reject a supplier quotation | — |

---

## 13. 🚚 Supplier Orders — `/api/supplier-orders`

| # | Method | Endpoint | Auth | Description | Body |
|---|--------|----------|------|-------------|------|
| 79 | GET | `/api/supplier-orders` | 🔴 | Get all supplier orders (Admin) | — |
| 80 | GET | `/api/supplier-orders/my-orders` | 🔴👤 | Supplier's own orders | — |
| 81 | GET | `/api/supplier-orders/my-invoices` | 🔴👤 | Supplier's own invoices | — |
| 82 | GET | `/api/supplier-orders/my-pending-count` | 🔴👤 | Supplier pending orders count | — |
| 83 | GET | `/api/supplier-orders/my-active-count` | 🔴👤 | Supplier active orders count | — |
| 84 | GET | `/api/supplier-orders/my-delivered-count` | 🔴👤 | Supplier delivered orders count | — |
| 85 | GET | `/api/supplier-orders/my-stats` | 🔴👤 | Supplier order stats | — |
| 86 | GET | `/api/supplier-orders/dispatch-list` | 🔴 | Orders ready to dispatch | — |
| 87 | GET | `/api/supplier-orders/invoiceable-orders` | 🔴 | Orders eligible for invoice | — |
| 88 | GET | `/api/supplier-orders/invoices` | 🔴 | All supplier invoices (Admin) | — |
| 89 | GET | `/api/supplier-orders/:id` | 🔴 | Get supplier order by ID | — |
| 90 | GET | `/api/supplier-orders/:id/delivery-progress` | 🔴 | Delivery progress for an order | — |
| 91 | GET | `/api/supplier-orders/supplier/:supplierId` | 🔴 | Orders by supplier ID (Admin) | — |
| 92 | PUT | `/api/supplier-orders/:id/status` | 🔴 | Update supplier order status | `{ "status": "Processing" }` |
| 93 | PUT | `/api/supplier-orders/:id/dispatch` | 🔴 | Dispatch a supplier order | — |
| 94 | PUT | `/api/supplier-orders/:id/confirm-delivery` | 🔴 | Confirm supplier delivery | — |
| 95 | PUT | `/api/supplier-orders/invoices/:id/accept` | 🔴 | Accept supplier payment | — |
| 96 | PUT | `/api/supplier-orders/invoices/:id/reject` | 🔴 | Reject supplier payment | — |
| 97 | POST | `/api/supplier-orders/:orderId/create-invoice` | 🔴 | Create invoice for supplier order | `{ "amount": 5000, "dueDate": "2026-07-10" }` |
| 98 | PATCH | `/api/supplier-orders/:id/acknowledge` | 🔴👤 | Supplier acknowledges order | — |

---

## 14. 🧾 Supplier Invoices — `/api/supplier-invoices`

| # | Method | Endpoint | Auth | Description | Body |
|---|--------|----------|------|-------------|------|
| 99 | GET | `/api/supplier-invoices` | 🔴 | All supplier invoices (Admin) | — |
| 100 | GET | `/api/supplier-invoices/my` | 🔴👤 | My supplier invoices | — |
| 101 | GET | `/api/supplier-invoices/all` | 🔴👤 | All my invoices (frontend alias) | — |
| 102 | GET | `/api/supplier-invoices/stats` | 🔴👤 | Supplier invoice stats | — |
| 103 | GET | `/api/supplier-invoices/paid-count/:email` | 🔴 | Paid invoice count by email | — |
| 104 | GET | `/api/supplier-invoices/unpaid-count/:email` | 🔴 | Unpaid invoice count by email | — |
| 105 | GET | `/api/supplier-invoices/overdue-count/:email` | 🔴 | Overdue invoice count by email | — |
| 106 | POST | `/api/supplier-invoices` | 🔴👤 | Supplier creates an invoice | `{ "orderId": "...", "amount": 5000, "dueDate": "2026-07-10" }` |
| 107 | POST | `/api/supplier-invoices/:invoiceID/payment` | 🔴 | Submit payment proof for invoice | `multipart/form-data`: `amount`, `paymentProof` (file) |
| 108 | PUT | `/api/supplier-invoices/accept-payment/:id` | 🔴 | Admin accepts payment | — |
| 109 | PUT | `/api/supplier-invoices/reject-payment/:id` | 🔴 | Admin rejects payment | — |

---

## 15. 💵 Supplier Payments — `/api/supplier-payments`

| # | Method | Endpoint | Auth | Description | Body |
|---|--------|----------|------|-------------|------|
| 110 | GET | `/api/supplier-payments` | 🔴👤 | Get all supplier payments | — |
| 111 | GET | `/api/supplier-payments/all` | 🔴👤 | My supplier payments (frontend alias) | — |
| 112 | GET | `/api/supplier-payments/stats` | 🔴👤 | Supplier payment stats | — |
| 113 | POST | `/api/supplier-payments` | 🔴👤 | Add a supplier payment | `{ "invoiceId": "...", "amount": 3000, "paymentMethod": "bank" }` |
| 114 | DELETE | `/api/supplier-payments/:id` | 🔴👤 | Delete a supplier payment | — |

---

## 16. 📊 Dashboard — `/api/dashboard`

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 115 | GET | `/api/dashboard/admin-stats` | 🔴👤 | Admin dashboard statistics |
| 116 | GET | `/api/dashboard/customer-stats` | 🔴👤 | Customer dashboard statistics |

---

## 🧪 Quick Test Sequence (Recommended Order)

```
Step 1: Register Admin     →  POST /api/users/register  (role: "Admin")
Step 2: Login Admin        →  POST /api/users/login      → copy token
Step 3: Set token in env   →  Postman environment: token = <paste here>
Step 4: Test dashboard     →  GET  /api/dashboard/admin-stats
Step 5: Register Customer  →  POST /api/users/register  (role: "Customer")
Step 6: Register Supplier  →  POST /api/users/register  (role: "Supplier")
Step 7: Test finance       →  GET  /api/finance/getTransactions
Step 8: Test stocks        →  GET  /api/stocks/getItems
```

---

## ⚠️ Common Issues & Tips

| Problem | Solution |
|---------|---------|
| `401 Unauthorized` | Token is missing, expired (1h), or wrong format — re-login |
| `403 Forbidden` | You're logged in but not Admin — use Admin account |
| `400 Bad Request` | Missing required fields in body — check the body schema |
| `404 Not Found` | Wrong `:id` or `:email` — verify the value exists in DB |
| Token format wrong | Must be `Bearer <token>` with a space, not just the token |
| File upload failing | Use `multipart/form-data` NOT `application/json` for upload routes |

---

## 📌 Test Credentials

| Role | Email | Password | Custom ID |
|------|-------|----------|-----------|
| Admin | `admin@example.com` | `Admin@123` | `ADM000001` |
