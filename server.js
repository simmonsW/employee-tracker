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

const departmentChoicesArr = (departmentChoices) => [
  {
    type: 'list',
    name: 'department',
    message: 'Which department would you like to remove?',
    choices: departmentChoices
  }
];

function viewAllEmployees() {
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
              ORDER BY employee.id;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(' ', result);
    startPrompt();
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

function removeDepartment(value) {
  const sql = `DELETE FROM department WHERE id = ?`;

  db.query(sql, value, (err) => {
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

    inquirer.prompt(departmentChoicesArr(departmentChoices))
      .then(data => {
        const departmentToRemove = [
          data.department
        ];

        removeDepartment(departmentToRemove);
        departmentChoices.map(dept => {
          if (dept.value === data.department) {
            console.log(`You have deleted ${dept.name} from Departments!`);
          }
        });
        startPrompt();
      });
  });
};

function viewAllRoles() {
  const sql = `SELECT
              role.id AS id,
              role.title AS title,
              role.salary AS salary,
              department.department_name AS department
              FROM role
              LEFT JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(' ', result);
    startPrompt();
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
      break;

    case 'View All Employees by Manager':
      break;

    case 'Add Employee':
      break;

    case 'Remove Employee':
      break;

    case 'Update Employee Role':
      break;

    case 'Update Employee Manager':
      break;

    case 'View All Roles':
      viewAllRoles();
      break;

    case 'Add Role':
      break;

    case 'Remove Role':
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