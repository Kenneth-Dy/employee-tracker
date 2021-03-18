USE employees_db;

INSERT INTO departments (name)
VALUES('Executive'),
('Engineers'),
('Marketing'),
('Sales'),
('IT');

USE employees_db;

INSERT INTO roles (title, salary, department_id )
VALUES('CEO', 500000, 1), ('Assistant', 75000, 1),
('Lead Engineer', 200000, 2), ('Engineer', 120000, 2),
('Lead Marketer', 175000, 3), ('Marketer', 60000, 3),
('Lead Sales', 200000, 4), ('Sales Associate', 40000, 4),
('Lead IT', 175000, 5), ('IT Technician', 50000, 5);

USE employees_db;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES('Burger', 'King', 1, NULL), ('John', 'Doe', 2, 1),
('Ronald', 'McDonald', 3, NULL), ('Jane', 'Doe', 4, 3),
('Ham', 'Burglar', 5, NULL), ('James', 'Doe', 6, 5),
('Wallace', 'Grimace', 7, NULL), ('Jamie', 'Doe', 8, 7),
('Jack', 'Inabox', 9, NULL), ('Jeff', 'Doe', 10, 9);