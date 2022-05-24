const fs = require('fs');
const inquirer = require('inquirer');
const mysql=require('mysql2')



const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'daeun',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

function init() {
    return inquirer.prompt({
        type: 'list',
        name:'selection',
        message: 'What would you like to do?',
        choices:[
            'View All Employees', 
            'Add Employee',
            'Update Employee Role', 
            'View All Roles', 
            'Add Role', 
            'View All Departments', 
            'Add Department', 
            'Quit'
        ]
    }).then(answer => {
        console.log(answer)
        switch(answer.selection) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRoles();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Quit':
                quit();
                break;
        }
    });
};

function viewAllEmployees() {
    db.query(
        `
        SELECT employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary,
        CONCAT(m.first_name,' ', m.last_name) AS manager
        FROM employee 
        LEFT JOIN role
        ON employee.role_id =role.id
        LEFT JOIN department
        ON role.department_id=department.id 
        LEFT JOIN employee m
        ON m.id=employee.manager_id
         `, (err, results)=>{
        if (err) throw err;
        console.table(results)
        init()
    });
};

function addEmployee() {
};

function updateEmployeeRoles() {

};

function viewAllRoles() {
    db.query(
        `SELECT employee.first_N, role.title, department.name AS department, role.salary  
         FROM role 
         JOIN department 
         ON role.department_id=department.id
         `, (err, results)=>{
        if (err) throw err;
        console.table(results)
        init()
    });
};

function addRole () {

};

function viewAllDepartments () {
    db.query('SELECT * FROM department ORDER BY id', (err, results)=>{
        if (err) throw err;
        console.table(results)
        init()
    });
};
    

function addDepartment () {

};

function quit () {
    return;
};

init();