const {
  viewEmployees,
  viewEmployeesSimple,
  addEmployee,
  removeEmployee,
  updateEmployeeRole,
  updateEmployeeManager
} = require('./Employee');

const {
  viewDepartments,
  addDepartment,
  removeDepartment,
} = require('./Department');

const {
  viewRoles,
  addRole,
  removeRole
} = require('./Role');

module.exports = {
  viewEmployees,
  viewEmployeesSimple,
  addEmployee,
  removeEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewDepartments,
  addDepartment,
  removeDepartment,
  viewRoles,
  addRole,
  removeRole
};