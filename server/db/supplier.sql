CREATE TABLE supplier (
    supp_id INT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    category TEXT,
    created_at DATE
);

CREATE TABLE supplier_quotation (
    sq_id INT PRIMARY KEY,
    supp_id INT REFERENCES supplier(supp_id),
    date DATE,
    total_estimate NUMERIC,
    currency TEXT,
    status TEXT
);

CREATE TABLE purchase_order (
    po_id INT PRIMARY KEY,
    emp_id INT REFERENCES employee(emp_id),
    date DATE,
    status TEXT,
    total_amount NUMERIC,
    payment_terms TEXT
);

CREATE TABLE goods_receipt (
    grn_id INT PRIMARY KEY,
    po_id INT REFERENCES purchase_order(po_id),
    received_date DATE,
    warehouse_location TEXT,
    received_by TEXT
);

CREATE TABLE supplier_bill (
    bill_id INT PRIMARY KEY,
    po_id INT REFERENCES purchase_order(po_id),
    total NUMERIC,
    bill_date DATE,
    tax_amount NUMERIC,
    payment_status TEXT
);

CREATE TABLE supplier_payment (
    sp_id INT PRIMARY KEY,
    bill_id INT REFERENCES supplier_bill(bill_id),
    amount NUMERIC,
    payment_date DATE,
    method TEXT,
    reference_number TEXT
);
