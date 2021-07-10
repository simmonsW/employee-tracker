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

function viewAllEmployees() {
  const sql = `SELECT employee.id,
              employee.first_name,
              employee.last_name,
              role.title AS title,
              department.department_name,
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
}

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
      break;

    case 'Add Role':
      break;

    case 'Remove Role':
      break;

    case 'View All Departments':
      break;

    case 'Add Department':
      break;

    case 'Remove Department':
      break;
  }
};

startPrompt();