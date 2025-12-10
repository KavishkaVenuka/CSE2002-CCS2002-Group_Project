CREATE TABLE customer (
    cust_id INT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    category TEXT,
    created_at DATE
);

CREATE TABLE sales_quotation (
    sq_id INT PRIMARY KEY,
    cust_id INT REFERENCES customer(cust_id),
    date DATE,
    total_estimate NUMERIC,
    validity TEXT,
    status TEXT
);

CREATE TABLE sales_order (
    so_id INT PRIMARY KEY,
    emp_id INT REFERENCES employee(emp_id),
    date DATE,
    status TEXT,
    total_amount NUMERIC,
    payment_terms TEXT
);

CREATE TABLE delivery_note (
    delivery_id INT PRIMARY KEY,
    so_id INT REFERENCES sales_order(so_id),
    delivery_date DATE,
    driver_name TEXT,
    vehicle_number TEXT,
    delivery_status TEXT
);

CREATE TABLE sales_invoice (
    inv_id INT PRIMARY KEY,
    delivery_id INT REFERENCES delivery_note(delivery_id),
    total NUMERIC,
    invoice_date DATE,
    tax_amount NUMERIC,
    payment_status TEXT
);

CREATE TABLE customer_payment (
    pay_id INT PRIMARY KEY,
    inv_id INT REFERENCES sales_invoice(inv_id),
    amount NUMERIC,
    payment_date DATE,
    payment_method TEXT,
    reference_number TEXT
);
