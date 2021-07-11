const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// start server after db connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});

const menuArr = [
  {
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Employees by Department',
      'View All Employees by Manager',
      'Add Employee',
      'Remove Employee',
      'Update Employee Role',
      'Update Employee Manager',
      'View All Roles',
      'Add Role',
      'Remove Role',
      'View All Departments',
      'Add Department',
      'Remove Department'
    ]
  }
];

const newDepartmentQuestionArr = [
  {
    type: 'input',
    name: 'department',
    message: "What is the name of this department?",
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter the name of the new department.');
        return false;
      };
    }
  }
];

const newRoleQuestionArr = (departmentChoices) => [
  {
    type: 'input',
    name: 'title',
    message: 'What is the title for this role?',
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter the title for the new role.');
        return false;
      };
    }
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary for this role?',
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please enter the salary for this new role.');
        return false;
      };
    }
  },
  {
    type: 'list',
    name: 'department',
    message: 'Which department does this role fall under?',
    choices: departmentChoices,
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please select a department for this role.');
        return false;
      };
    }
  }
];

const roleArr = (roleChoices) => [
  {
    type: 'list',
    name: 'role',
    message: 'Which role would you like to delete?',
    choices: roleChoices,
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please choose a role to delete.');
        return false;
      };
    }
  }
];

const departmentChoicesArr = (departmentChoices) => [
  {
    type: 'list',
    name: 'department',
    message: 'Which department would you like to remove?',
    choices: departmentChoices
  }
];

const addEmployeeQuestionArr = (roleChoices, managerChoices) => [
  {
    type: 'input',
    name: 'first_name',
    message: "What is the employee's first name?",
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log("Please enter the employee's first name.");
        return false;
      };
    }
  },
  {
    type: 'input',
    name: 'last_name',
    message: "What is the employee's last name?",
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log("Please enter the employee's last name.");
        return false;
      };
    }
  },
  {
    type: 'list',
    name: 'role',
    message: "What is the employee's role?",
    choices: roleChoices,
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please select a role for the employee.');
        return false;
      };
    }
  },
  {
    type: 'list',
    name: 'manager',
    message: "Who is the employee's manager?",
    choices: managerChoices,
    validate: input => {
      if (input) {
        return true;
      } else {
        console.log('Please choose a manager for the employee.');
        return false;
      };
    }
  }
];

const employeesArr = (employeeChoices) => [
  {
    type : 'list',
    name: 'employee',
    message: 'Who would you like to remove?',
    choices: employeeChoices
  }
];

const updateEmployeeRoleQuestionArr = (employeeChoices, roleChoices) => [
  {
    type: 'list',
    name: 'name',
    message: 'Which employee would you like to update?',
    choices: employeeChoices
  },
  {
    type: 'list',
    name: 'role',
    message: "What is this employee's new role?",
    choices: roleChoices
  }
];

const updateEmployeeManagerQuestionArr = (employeeChoices, managerChoices) => [
  {
    type: 'list',
    name: 'name',
    message: 'Which employee would you like to update?',
    choices: employeeChoices
  },
  {
    type: 'list',
    name: 'manager',
    message: "Who is the employee's new manager?",
    choices: managerChoices
  }
];

const viewByDepartmentQuestionArr = (departmentChoices) => [
  {
    type: 'list',
    name: 'department',
    message: 'Please select a department',
    choices: departmentChoices
  }
];

const viewByManagerQuestionArr = (managerChoices) => [
  {
    type: 'list',
    name: 'manager',
    message: 'Please select a manager.',
    choices: managerChoices
  }
];

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

function viewAllEmployees() {
  viewEmployees(result => {
    console.table(' ', result);
    startPrompt()
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
        .prompt(addEmployeeQuestionArr(roleChoices, managerChoices))
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
      .prompt(employeesArr(employeeChoices))
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
        .prompt(updateEmployeeRoleQuestionArr(employeeChoices, roleChoices))
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
        .prompt(updateEmployeeManagerQuestionArr(employeeChoices, managerChoices))
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

function viewDepartments(cb) {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    cb(result);
  });
};

function viewAllDepartments() {
  viewDepartments(result => {
    console.table(' ', result);
    startPrompt();
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

function addDepartmentPrompt() {
  inquirer
    .prompt(newDepartmentQuestionArr)
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
      .prompt(departmentChoicesArr(departmentChoices))
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
}

function viewAllRoles() {
  viewRoles(result => {
    console.table(' ', result);
    startPrompt();
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

function addRolePrompt() {
  viewDepartments(rows => {
    const departmentChoices = rows.map(row => ({
      name: row.department_name,
      value: row.id
    }));

    inquirer
      .prompt(newRoleQuestionArr(departmentChoices))
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
      .prompt(roleArr(roleChoices))
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

function viewByDepartmentPrompt() {
  viewDepartments(rows => {
    const departmentChoices = rows.map(row => ({
      name: row.department_name,
      value: row.id
    }));

    inquirer
      .prompt(viewByDepartmentQuestionArr(departmentChoices))
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

function viewByManagerPrompt() {
  viewEmployeesSimple(rows => {
    const managerChoices = rows.map(row => ({
      name: row.name,
        value: row.id
    }));

    inquirer
      .prompt(viewByManagerQuestionArr(managerChoices))
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
          console.table(' ', result);
          startPrompt();
        });
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

    case 'Add Department':
      addDepartmentPrompt();
      break;

    case 'Remove Department':
      removeDepartmentPrompt();
      break;
  }
};

startPrompt();