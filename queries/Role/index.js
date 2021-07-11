const db = require('../../db/connection');

function viewRoles(cb) {
  const sql = `SELECT
              role.id AS id,
              role.title AS title,
              role.salary AS salary,
              department.department_name AS department
              FROM role
              LEFT JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    cb(result);
  });
};

function addRole(values) {
  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

  db.query(sql, values, (err) => {
    if (err) throw err;
  });
};

function removeRole(id) {
  const sql = `DELETE FROM role WHERE id = ?`;

  db.query(sql, id, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  viewRoles,
  addRole,
  removeRole,
};