CREATE TABLE department (
    dept_id INT PRIMARY KEY,
    name TEXT,
    cost_center TEXT,
    head_of_department TEXT,
    location TEXT,
    created_at DATE
);

CREATE TABLE employee (
    emp_id INT PRIMARY KEY,
    dept_id INT REFERENCES department(dept_id),
    name TEXT,
    role TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    join_date DATE,
    salary NUMERIC,
    employment_status TEXT
);

CREATE TABLE payslip (
    payslip_id INT PRIMARY KEY,
    emp_id INT REFERENCES employee(emp_id),
    net_salary NUMERIC,
    pay_date DATE,
    gross_salary NUMERIC,
    tax_amount NUMERIC,
    epf NUMERIC,
    etf NUMERIC
);

CREATE TABLE expense_record (
    exp_id INT PRIMARY KEY,
    emp_id INT REFERENCES employee(emp_id),
    amount NUMERIC,
    status TEXT,
    type TEXT,
    description TEXT,
    submitted_date DATE,
    approved_date DATE
);
