const fs=require('fs');
const inquirer=require('inquirer');

function init() {
    return inquirer.prompt({
        type: 'list',
        name:'questions',
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
    });
};

init();