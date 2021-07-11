const db = require('../../db/connection');

function viewDepartments(cb) {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    cb(result);
  });
};

function addDepartment(value) {
  const sql = `INSERT INTO department (department_name) VALUES (?)`;

  db.query(sql, value, (err) => {
    if (err) throw err;
  });
};

function removeDepartment(id) {
  const sql = `DELETE FROM department WHERE id = ?`;

  db.query(sql, id, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  viewDepartments,
  addDepartment,
  removeDepartment,
};