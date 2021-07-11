//*************//
//* MAIN MENU *//
//*************//

const menuArr = [
  {
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: [
      "I'm All Done",
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
      'View Department Budget',
      'Add Department',
      'Remove Department'
    ]
  }
];

//******************************//
//* DEPARTMENT QUESTION ARRAYS *//
//******************************//

const newDepartmentQsArr = [
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

const removeDepartmentQsArr = (departmentChoices) => [
  {
    type: 'list',
    name: 'department',
    message: 'Which department would you like to remove?',
    choices: departmentChoices
  }
];

const viewByDepartmentQsArr = (departmentChoices) => [
  {
    type: 'list',
    name: 'department',
    message: 'Please select a department',
    choices: departmentChoices
  }
];

//************************// 
//* ROLE QUESTION ARRAYS *//
//************************// 

const newRoleQsArr = (departmentChoices) => [
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

const roleQsArr = (roleChoices) => [
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

//****************************//
//* EMPLOYEE QUESTION ARRAYS *//
//****************************//

const addEmployeeQsArr = (roleChoices, managerChoices) => [
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

const removeEmployeeQsArr = (employeeChoices) => [
  {
    type : 'list',
    name: 'employee',
    message: 'Who would you like to remove?',
    choices: employeeChoices
  }
];

const updateEmployeeRoleQsArr = (employeeChoices, roleChoices) => [
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

const updateEmployeeManagerQsArr = (employeeChoices, managerChoices) => [
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

const viewByManagerQsArr = (managerChoices) => [
  {
    type: 'list',
    name: 'manager',
    message: 'Please select a manager.',
    choices: managerChoices
  }
];

module.exports = {
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
}