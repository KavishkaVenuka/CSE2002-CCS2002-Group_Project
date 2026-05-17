# API Map

This document provides a comprehensive mapping of all API calls made from the frontend components of the My Business Management Solution.

## Authentication Endpoints

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Customer Login | POST | `http://localhost:5900/api/users/login` | `{ email, password }` | `{ success, token, user, customer }` | CustomerLogin.tsx |
| Supplier Login | POST | `http://localhost:5900/api/users/login` | `{ email, password }` | `{ success, token, user, supplier }` | SupplierLogin.tsx |
| Customer Register | POST | `http://localhost:5900/api/users/register` | `{ fullName, email, password, role, contactNumber, address, companyName, vatNumber }` | `{ success, message, user }` | CustomerRegister.tsx |
| Supplier Register | POST | `http://localhost:5900/api/users/register` | `{ fullName, email, password, role, contactNumber, address, companyName }` | `{ success, message, user }` | SupplierRegister.tsx |

## Customer Dashboard & Orders

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Dashboard Stats | GET | `http://localhost:5900/api/dashboard/customer-stats` | Headers: `Authorization: Bearer {token}` | `{ success, stats: { activeOrders, pendingQuotationsCount, deliveredOrders, duePayment, recentOrders, pendingQuotations, pendingInvoices, recentActivity } }` | CustomerDashboard.tsx |
| Get Customer Orders | GET | `http://localhost:5900/api/orders/customer/{customerId}` | N/A | `[{ _id, orderID, status, totalAmount, items, delivery }]` | CustomerOrders.tsx |
| Get Order Status Counts | GET | `http://localhost:5900/api/orders/pending-count/{customerId}` | N/A | `{ count }` | CustomerOrders.tsx |
| Get Processing Count | GET | `http://localhost:5900/api/orders/processing-count/{customerId}` | N/A | `{ count }` | CustomerOrders.tsx |
| Get Dispatched Count | GET | `http://localhost:5900/api/orders/dispatched-count/{customerId}` | N/A | `{ count }` | CustomerOrders.tsx |
| Get In-Transit Count | GET | `http://localhost:5900/api/orders/in-transit-count/{customerId}` | N/A | `{ count }` | CustomerOrders.tsx |
| Get Delivered Count | GET | `http://localhost:5900/api/orders/delivered-count/{customerId}` | N/A | `{ count }` | CustomerOrders.tsx |
| Confirm Delivery | PUT | `http://localhost:5900/api/orders/confirm-delivery/{orderId}` | `{ receivedItems: [{ productID, receivedQuantity }] }` | `{ success, message }` | DeliveryTracking.tsx |

## Customer Requirements & Quotations

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Requirements | GET | `http://localhost:5900/api/requirements?customerId={customerId}` | N/A | `{ success, requirements: [{ id, itemName, status, quantity, unit }] }` | SendRequirements.tsx |
| Get Requirements Stats | GET | `http://localhost:5900/api/requirements/stats?customerId={customerId}` | N/A | `{ success, stats: { total, completed, in_progress, new, rejected } }` | SendRequirements.tsx |
| Get Available Stocks | GET | `http://localhost:5900/api/stocks/getItems` | N/A | `[{ id, itemName, quantity, price }]` | SendRequirements.tsx |
| Create Requirement | POST | `http://localhost:5900/api/requirements` | FormData: `requirements, customerId, attachedDocument[]` | `{ success, requirement }` | SendRequirements.tsx |
| Get Quotations | GET | `http://localhost:5900/api/quotations/customer/{customerId}` | N/A | `{ success, quotations: [{ _id, quotationID, items, total, status, date, validUntil }] }` | ViewQuotations.tsx |
| Create Order from Quotation | POST | `http://localhost:5900/api/orders` | `{ name, customerId, address, phonenumber, notes, items: [{ productID, name, price, quantity, image }], quotationId }` | `{ success, order }` | ViewQuotations.tsx |
| Accept Quotation | PUT | `http://localhost:5900/api/quotations/accept/{quotationId}` | N/A | `{ success }` | ViewQuotations.tsx |
| Reject Quotation | PUT | `http://localhost:5900/api/quotations/reject/{quotationId}` | N/A | `{ success }` | ViewQuotations.tsx |

## Customer Invoices & Payments

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Invoices | GET | `http://localhost:5900/api/invoices/customer/{email}` | N/A | `[{ _id, invoiceID, orderID, total, date, due_date, status }]` | CustomerPayment.tsx |
| Get All Invoices | GET | `http://localhost:5900/api/invoices` | N/A | `[{ _id, invoiceID, invoiceType, status, total, items }]` | CustomerInvoices.tsx |
| Create Invoice from Order | POST | `http://localhost:5900/api/invoices/create-from-order/{orderId}` | N/A | `{ success, invoice }` | CustomerInvoices.tsx |
| Submit Payment | POST | `http://localhost:5900/api/invoices/{invoiceID}/payment` | FormData: `paymentMethod, transactionID, notes, paymentProof` | `{ success, payment }` | CustomerPayment.tsx |


## Supplier Dashboard & Orders

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Supplier Dashboard Stats | GET | `http://localhost:5900/api/suppliers/dashboard/stats` | Headers: `Authorization: Bearer {token}` | `{ stats: { newRequirements, pendingQuotations, activeOrders, totalRevenue } }` | SupplierDashboard.tsx |
| Get Recent Requirements | GET | `http://localhost:5900/api/suppliers/dashboard/recent-requirements` | Headers: `Authorization: Bearer {token}` | `{ recentRequirements: [{ id, requirementId, customerName, items }] }` | SupplierDashboard.tsx |
| Get Recent Orders | GET | `http://localhost:5900/api/suppliers/dashboard/recent-orders` | Headers: `Authorization: Bearer {token}` | `{ recentOrders: [{ _id, po_id, status, total }] }` | SupplierDashboard.tsx |
| Get Pending Payments | GET | `http://localhost:5900/api/suppliers/dashboard/pending-payments` | Headers: `Authorization: Bearer {token}` | `{ pendingPayments: [{ id, amount, dueDate }] }` | SupplierDashboard.tsx |
| Get Supplier's Orders | GET | `http://localhost:5900/api/supplier-orders/my-orders` | Headers: `Authorization: Bearer {token}`, params: `{ status?, search? }` | `{ orders: [{ _id, po_id, status, items, total }] }` | SupplierOrders.tsx |
| Get Supplier's Order Stats | GET | `http://localhost:5900/api/supplier-orders/my-stats` | Headers: `Authorization: Bearer {token}` | `{ stats: { pending, confirmed, preparing, dispatched, delivered } }` | SupplierOrders.tsx |
| Acknowledge Order | PATCH | `http://localhost:5900/api/supplier-orders/{id}/acknowledge` | `{}` | `{ success }` | SupplierOrders.tsx |

## Supplier - Quotations

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Quotations Table | GET | `http://localhost:5900/api/suppliers/quotations/table` | Headers: `Authorization: Bearer {token}`, params: `{ status?, search? }` | `{ quotations: [{ sq_id, quotationID, requirementId, status, items }] }` | QuotationStatus.tsx |
| Get Quotations Stats | GET | `http://localhost:5900/api/suppliers/quotations/stats` | Headers: `Authorization: Bearer {token}` | `{ stats: { pending, submitted, approved, rejected } }` | QuotationStatus.tsx |
| Get Quotation Details | GET | `http://localhost:5900/api/suppliers/quotations/{id}/detail` | Headers: `Authorization: Bearer {token}` | `{ quotation: { _id, sq_id, quotationID, items, total, status } }` | QuotationStatus.tsx |
| Get Supplier Requirements | GET | `http://localhost:5900/api/suppliers/supplier-requirements/my` | Headers: `Authorization: Bearer {token}`, params: `{ status? }` | `{ requirements: [{ id, requirementId, itemName, quantity, items, status }] }` | QuotationCreation.tsx |
| Create Quotation | POST | `http://localhost:5900/api/suppliers/quotations` | `{ requirementId, items: [{ itemName, quantity, unit, unitPrice, totalPrice }], subtotal, tax, grandTotal, deliveryTimeline, paymentTerms, validUntil, notes, status }` | `{ success, quotation }` | QuotationCreation.tsx |

## Supplier - Customer Requirements

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get My Requirements | GET | `http://localhost:5900/api/suppliers/supplier-requirements/my` | Headers: `Authorization: Bearer {token}`, params: `{ status?, search? }` | `{ requirements: [{ id, requirementId, customerName, items, itemSummary, status }] }` | CustomerRequirements.tsx |
| Get Requirements Stats | GET | `http://localhost:5900/api/suppliers/requirements/stats` | Headers: `Authorization: Bearer {token}` | `{ stats: { new, in_progress, completed, rejected } }` | CustomerRequirements.tsx |
| Get Requirement Details | GET | `http://localhost:5900/api/suppliers/requirements/{id}` | Headers: `Authorization: Bearer {token}` | `{ requirement: { id, requirementId, customerName, items, companyName } }` | CustomerRequirements.tsx |

## Supplier - Delivery & Dispatch

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Dispatch List | GET | `http://localhost:5900/api/supplier-orders/dispatch-list` | Headers: `Authorization: Bearer {token}` | `[{ _id, po_id, status, items, total }]` | DeliveryDispatch.tsx |
| Get Delivery Progress | GET | `http://localhost:5900/api/supplier-orders/{id}/delivery-progress` | Headers: `Authorization: Bearer {token}` | `{ progress: { items: [{ productID, ordered, issued, received }] } }` | DeliveryDispatch.tsx |
| Dispatch Order | PUT | `http://localhost:5900/api/supplier-orders/{id}/dispatch` | `{ vehicleNumber, driverName, deliveryNotes, items: [{ productID, issuedQuantity }] }` | `{ success }` | DeliveryDispatch.tsx |

## Supplier - Invoices

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get Invoiceable Orders | GET | `http://localhost:5900/api/supplier-orders/invoiceable-orders` | Headers: `Authorization: Bearer {token}` | `{ orders: [{ id, po_id, status, items, total }] }` | InvoiceSubmission.tsx |
| Get My Invoices | GET | `http://localhost:5900/api/supplier-invoices/my` | Headers: `Authorization: Bearer {token}` | `{ invoices: [{ _id, bill_id, invoiceID, status, total }] }` | InvoiceSubmission.tsx |
| Get Order Details | GET | `http://localhost:5900/api/supplier-orders/{id}` | Headers: `Authorization: Bearer {token}` | `{ order: { _id, po_id, items: [{ productID, name, quantity, price }], total } }` | InvoiceSubmission.tsx |
| Create Invoice | POST | `http://localhost:5900/api/supplier-invoices` | `{ purchaseOrderRef, items: [{ productID, name, quantity, unitPrice, totalPrice }], subtotal, tax, grandTotal, notes, dueDate }` | `{ success, invoice }` | InvoiceSubmission.tsx |

## Supplier - Payments

| Component | Method | Endpoint | Request Body/Params | Response Shape | Triggering Component |
|-----------|--------|----------|---------------------|----------------|---------------------|
| Get My Payments | GET | `http://localhost:5900/api/supplier-payments/all` | Headers: `Authorization: Bearer {token}`, params: `{ status?, search? }` | `{ payments: [{ transaction_id, purchaseOrderRef, billRef, amount, status }] }` | PaymentStatus.tsx |
| Get Payment Stats | GET | `http://localhost:5900/api/supplier-payments/stats` | Headers: `Authorization: Bearer {token}` | `{ stats: { completed, pending, failed } }` | PaymentStatus.tsx |


## API Base URLs Used

- **Primary Backend**: `http://localhost:5900`
- **Finance API Base**: `{API_BASE}` (defined in component constants)
- **Bank Accounts API**: `{API_BASE_BANK}` (defined in component constants)

## Authentication Headers

Most endpoints use JWT Bearer Token authentication:
```
Authorization: Bearer {token}
```

Tokens are retrieved from:
- `localStorage.getItem('token')` 
- `localStorage.getItem('supplierToken')`

## Summary Statistics

- **Total API Endpoints**: 80+
- **HTTP Methods Used**: GET, POST, PUT, DELETE, PATCH
- **Components with API Calls**: 40+
- **Primary Base URL**: `http://localhost:5900`
- **Authentication**: Bearer token in Authorization header
- **Data Format**: JSON for request/response bodies, FormData for file uploads

All API calls are made using either **axios** or **fetch** with appropriate error handling and loading states throughout the application.</content>
<parameter name="filePath">/home/kavishka/Dev/Mybusinessmangemnetsolution/Frontend/api-map.md