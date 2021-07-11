const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const {
  menuArr,
  newDepartmentQsArr,
  removeDepartmentQsArr,
  viewByDepartmentQsArr,
  newRoleQsArr,
  roleQsArr,
  addEmployeeQsArr,
  removeEmployeeQsArr,
  updateEmployeeRoleQsArr,
  updateEmployeeManagerQsArr,
  viewByManagerQsArr
} = require('./queries/utils/helpers');

const {
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
} = require('./queries');

//********************//
//* EMPLOYEE PROMPTS *//
//********************//

function viewAllEmployees() {
  viewEmployees(result => {
    console.table(' ', result);
    startPrompt();
  });
};

function addEmployeePrompt() {
  viewRoles(rows => {
    const roleChoices = rows.map(row => ({
      name: row.title,
      value: row.id
    }));

    viewEmployeesSimple(rows => {
      const managerChoices = rows.map(row => ({
        name: row.name,
        value: row.id
      }));
      const noManager = {
        name: 'NONE',
        value: null
      };
      managerChoices.push(noManager);

      inquirer
        .prompt(addEmployeeQsArr(roleChoices, managerChoices))
        .then(data => {
          const params = [
            data.first_name,
            data.last_name,
            data.role,
            data.manager
          ];

          addEmployee(params);
          console.log(`Added ${data.first_name} ${data.last_name} successfully!`);
          startPrompt();
        });
    });
  });
};

function removeEmployeePrompt() {
  viewEmployeesSimple(rows => {
    const employeeChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));

    inquirer
      .prompt(removeEmployeeQsArr(employeeChoices))
      .then(data => {
        const employeeToRemove = [
          data.employee
        ];

        removeEmployee(employeeToRemove);
        employeeChoices.map(employed => {
          if (employed.value === data.employee) {
            console.log(`You have removed ${employed.name}`);
          }
        });
        startPrompt();
      });
  });
};

function updateEmployeeRolePrompt() {
  viewEmployeesSimple(rows => {
    const employeeChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));

    viewRoles(rows => {
      const roleChoices = rows.map(row => ({
        name: row.title,
        value: row.id
      }));

      inquirer
        .prompt(updateEmployeeRoleQsArr(employeeChoices, roleChoices))
        .then(data => {
          const params = [
            data.role,
            data.name
          ];

          updateEmployeeRole(params);
          employeeChoices.map(updatedEmployee => {
            if (updatedEmployee.value === data.name) {
              console.log(`Updated ${updatedEmployee.name}'s role successfully!`);
            }
          })
          startPrompt();
        });
    });
  });
};

function updateEmployeeManagerPrompt() {
  viewEmployeesSimple(rows => {
    const employeeChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));
    
    viewEmployeesSimple(rows => {
      const managerChoices = rows.map(row => ({
        name: row.name,
        value: row.id
      }));
      const noManager = {
        name: 'NONE',
        value: null
      };
      managerChoices.push(noManager);
      

      inquirer
        .prompt(updateEmployeeManagerQsArr(employeeChoices, managerChoices))
        .then(data => {
          const params = [
            data.manager,
            data.name
          ];

          updateEmployeeManager(params);
          employeeChoices.map(employee => {
            if (employee.value === data.name) {
              console.log(`Updated ${employee.name}'s manager successfully!`);
            }
          });
          startPrompt();
        });
    });
  });
};

function viewByManagerPrompt() {
  viewEmployeesSimple(rows => {
    const managerChoices = rows.map(row => ({
      name: row.name,
        value: row.id
    }));

    inquirer
      .prompt(viewByManagerQsArr(managerChoices))
      .then(data => {
        const managerId = [
          data.manager
        ];

        const sql = `SELECT
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    role.title AS title,
                    department.department_name AS department,
                    role.salary AS salary,
                    CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
                    FROM employee
                    INNER JOIN role ON employee.role_id = role.id
                    INNER JOIN department ON role.department_id = department.id
                    INNER JOIN employee AS manager ON employee.manager_id = manager.id
                    WHERE manager.id = ${managerId}`;
        db.query(sql, managerId, (err, result) => {
          if (err) throw err;
          // console.table(' ', result);
          if (result.length === 0) {
            console.log(' ');
            console.log('This employee does not manage any employees');
            console.log('');
          } else {
            console.table(' ', result);
          }
          startPrompt();
        });
      });
  });
};

//**********************//
//* DEPARTMENT PROMPTS *//
//**********************//

function viewAllDepartments() {
  viewDepartments(result => {
    console.table(' ', result);
    startPrompt();
  });
};

function addDepartmentPrompt() {
  inquirer
    .prompt(newDepartmentQsArr)
    .then(data => {
      const newDepartment = [
        data.department
      ];

      addDepartment(newDepartment);
      console.log(`${newDepartment} has been created!`);
      startPrompt();
    });
};

function removeDepartmentPrompt() {
  viewDepartments(rows => {
    const departmentChoices = rows.map(row => ({
      name: row.department_name,
      value: row.id
    }));

    inquirer
      .prompt(removeDepartmentQsArr(departmentChoices))
      .then(data => {
        const departmentToRemove = [
          data.department
        ];

        removeDepartment(departmentToRemove);
        departmentChoices.map(dept => {
          if (dept.value === data.department) {
            console.log(`You have deleted ${dept.name} from Departments`);
          }
        });
        startPrompt();
      });
  });
};

function viewByDepartmentPrompt() {
  viewDepartments(rows => {
    const departmentChoices = rows.map(row => ({
      name: row.department_name,
      value: row.id
    }));

    inquirer
      .prompt(viewByDepartmentQsArr(departmentChoices))
      .then(data => {
        const deptId = [
          data.department
        ];

        const sql = `SELECT
              department.department_name AS department,
              employee.id,
              employee.first_name,
              employee.last_name,
              role.title,
              role.salary
              FROM employee
              INNER JOIN role ON employee.role_id = role.id
              INNER JOIN department ON role.department_id = department.id
              WHERE department.id = ${deptId}`;
        db.query(sql, deptId, (err, result) => {
          if (err) throw err;
          console.table(' ', result);
          startPrompt();
        });
      });
  });
};

function viewDepartmentBudgetPrompt() {
  viewDepartments(rows => {
    const departmentChoices = rows.map(row => ({
      name: row.department_name,
      value: row.id
    }));

    inquirer
      .prompt(viewByDepartmentQsArr(departmentChoices))
      .then(data => {
        const deptId = [
          data.department
        ];

        const sql = `SELECT
              department.department_name AS department,
              employee.id,
              employee.first_name,
              employee.last_name,
              role.title,
              role.salary
              FROM employee
              INNER JOIN role ON employee.role_id = role.id
              INNER JOIN department ON role.department_id = department.id
              WHERE department.id = ${deptId}`;
        const sqlSum = `SELECT
                        department.department_name AS department,
                        SUM(salary) AS total_budget
                        FROM role 
                        LEFT JOIN department ON role.department_id = department.id
                        WHERE department.id = ${deptId}`;
        db.query(sql, deptId, (err, result) => {
          if (err) throw err;
          console.table(' ', result);
          // startPrompt();
          db.query(sqlSum, deptId, (err, result) => {
            if (err) throw err;
            console.table(result);
            startPrompt();
          });
        });
      });
  });
};

//****************//
//* ROLE PROMPTS *//
//****************//

function viewAllRoles() {
  viewRoles(result => {
    console.table(' ', result);
    startPrompt();
  });
};

function addRolePrompt() {
  viewDepartments(rows => {
    const departmentChoices = rows.map(row => ({
      name: row.department_name,
      value: row.id
    }));

    inquirer
      .prompt(newRoleQsArr(departmentChoices))
      .then(data => {
        const params = [
          data.title,
          data.salary,
          data.department
        ];

        addRole(params);
        console.log(`Created ${data.title} successfully!`);
        startPrompt();
      });
  });
};

function removeRolePrompt() {
  viewRoles(rows => {
    const roleChoices = rows.map(row => ({
      name: row.title,
      value: row.id
    }));

    inquirer
      .prompt(roleQsArr(roleChoices))
      .then(data => {
        const roleToRemove = [
          data.role
        ];

        removeRole(roleToRemove);
        roleChoices.map(role => {
          if (role.value === data.role) {
            console.log(`You have deleted the role of ${role.name}`);
          }
        });
        startPrompt();
      });
  });
};

// start the inquirer prompt
async function startPrompt() {
  const { menu } = await inquirer.prompt(menuArr);

  switch (menu) {

    case 'View All Employees':
      viewAllEmployees();
      break;

    case 'View All Employees by Department':
      viewByDepartmentPrompt();
      break;

    case 'View All Employees by Manager':
      viewByManagerPrompt();
      break;

    case 'Add Employee':
      addEmployeePrompt();
      break;

    case 'Remove Employee':
      removeEmployeePrompt();
      break;

    case 'Update Employee Role':
      updateEmployeeRolePrompt();
      break;

    case 'Update Employee Manager':
      updateEmployeeManagerPrompt();
      break;

    case 'View All Roles':
      viewAllRoles();
      break;

    case 'Add Role':
      addRolePrompt();
      break;

    case 'Remove Role':
      removeRolePrompt();
      break;

    case 'View All Departments':
      viewAllDepartments();
      break;

    case 'View Department Budget':
      viewDepartmentBudgetPrompt();
      break;

    case 'Add Department':
      addDepartmentPrompt();
      break;

    case 'Remove Department':
      removeDepartmentPrompt();
      break;
    
    default:
      break;
  }
};

// start server after db connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    // console.log(`server running on port ${PORT}`);

    // I promise it looks right in the terminal!
    console.log(`
      ,---------------------------------------.
      |   ___            _                    |
      |  | __|_ __  _ __| |___ _  _ ___ ___   |
      |  | _|| '  \\| '_ \\ / _ \\ || / -_) -_)  |
      |  |___|_|_|_| .__/_\\___/\\_, \\___\\___|  |
      |       _____|_|         |__/           |
      |      |_   _| _ __ _ __| |_____ _ _    |
      |        | || '_/ _\` / _| / / -_) '_|   |
      |        |_||_| \\__,_\\__|_\\_\\___|_|     |
      |                                       |
      \`---------------------------------------'
    `);
    startPrompt();
  });
});
