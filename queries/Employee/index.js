const db = require('../../db/connection');

function viewEmployees(cb) {
  const sql = `SELECT
              employee.id,
              employee.first_name,
              employee.last_name,
              role.title AS title,
              department.department_name AS department,
              role.salary,
              CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
              FROM employee
              LEFT JOIN role ON employee.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              LEFT JOIN employee AS manager ON employee.manager_id = manager.id
              ORDER BY employee.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    cb(result);
  });
};

function viewEmployeesSimple(cb) {
  const sql = `SELECT
              employee.id,
              CONCAT(employee.first_name, ' ' , employee.last_name) AS name
              FROM employee`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    cb(result);
  });
};

function addEmployee(values) {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

  db.query(sql, values, (err) => {
    if (err) throw err;
  });
};

function removeEmployee(id) {
  const sql = `DELETE FROM employee WHERE id = ?`;

  db.query(sql, id, (err) => {
    if (err) throw err;
  });
};

function updateEmployeeRole(ids) {
  const sql = `UPDATE employee
              SET role_id = ?
              WHERE id = ?`;

  db.query(sql, ids, (err) => {
    if (err) throw err;
  });
};

function updateEmployeeManager(ids) {
  const sql = `UPDATE employee
              SET manager_id = ?
              WHERE id = ?`;
  db.query(sql, ids, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  viewEmployees,
  viewEmployeesSimple,
  addEmployee,
  removeEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
};