INSERT INTO department (department_name)
VALUES
  ('HR'),
  ('Sales'),
  ('IT'),
  ('Marketing'),
  ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
  ('HR Director', 60000, 1),
  ('Recruiter', 25000, 1),
  ('Sales Supervisor', 35000, 2),
  ('Sales Consultant', 25000, 2),
  ('Lead Software Engineer', 70000, 3),
  ('Software Engineer', 60000, 3),
  ('Marketing Manager', 40000, 4),
  ('Marketing Analyst', 35000, 4),
  ('Finance Manager', 50000, 5),
  ('Financial Analyst', 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Timmy', 'Tim', 2, 1),
  ('Davey', 'Dave', 3, NULL),
  ('Jimmy', 'Jim', 4, 3),
  ('Tommy', 'Tom', 5, NULL),
  ('Barney', 'Barnes', 6, 5),
  ('Johnny', 'John', 7, NULL),
  ('Tina', 'Belcher', 8, 7),
  ('Briana', 'Smith', 9, NULL),
  ('Britney', 'Adams', 10, 9);