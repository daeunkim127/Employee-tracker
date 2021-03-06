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
    db.query(`SELECT * FROM role;`,(err, res)=>{
        if (err) throw err;
        const roleChoices = res.map(role => ({name:role.title, value: role.id}));

        db.query(`SELECT * FROM employee;`,(err, res)=>{
            if (err) throw err;
            const managerChoices = res.map(employee => ({name:employee.first_name+' '+employee.last_name, value: employee.id}));
        
            inquirer.prompt([
                {
                    type:'input',
                    name:'employeeFirstName',
                    message:`What is the employee's first name?`
                },
                {
                    type:'input',
                    name: 'employeeLastName',
                    message:`What is the employee's last name?`
                },
                {
                    type:'list',
                    name:'employeeRole',
                    message:`What is the employee's role?`,
                    choices:roleChoices
                },
                {
                    type:'list',
                    name:'employeeManager',
                    message:`Who is meployee's manager?`,
                    choices:managerChoices
                }
            ]).then((answer)=>{
                db.query(`INSERT INTO employee SET ?`,{
                    first_name:answer.employeeFirstName,
                    last_name: answer.employeeLastName,
                    role_id:answer.employeeRole,
                    manager_id: answer.employeeManager
                }, (err,res)=>{
                    if (err) throw err;
                    console.log('\n NEW EMPLOYEE ADDED! \n');
                    init();
                })
            });
        });
    });
}

function updateEmployeeRoles() {
    db.query(`SELECT * FROM employee;`, (err,res)=> {
        if (err) throw err;
        const employeeChoices = res.map(employee =>({name: employee.first_name+' '+employee.last_name, value: employee.id}));

        db.query(`SELECT * FROM role;`, (err,res)=> {
            if (err) throw err;
            const roleChoices = res.map(role => ({name:role.title, value: role.id}));
                
            inquirer.prompt([
                {
                    type:'list',
                    name:'updateEmployee',
                    message:`Which employee's role do you want to update?`,
                    choices: employeeChoices
                },
                {
                    type:'list',
                    name:'updateEmployeeRole',
                    message:`Which role do you want to assign the selected employee?`,
                    choices: roleChoices
                }
            ]).then((answer)=>{
                db.query(`UPDATE employee SET ? WHERE ?`,
                [
                    {
                        role_id:answer.updateEmployeeRole
                    },
                    {
                        id:answer.updateEmployee
                    }
                ], (err, res)=> {
                    if (err) throw err;
                    console.log(`\n EMPLOYEE'S ROLE IS UPDATED! \n`)
                    init();
                })
            });
        });
    });
};

function viewAllRoles() {
    db.query(
        `SELECT role.id, role.title, department.name AS department, role.salary  
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
    db.query(`SELECT * FROM department;`,(err, res)=>{
        if (err) throw err;
        const departmentChoice = res.map(department => ({name:department.name, value: department.id}));
        inquirer.prompt([
            {
                type:'input',
                name:'roleTitle',
                message:'What is the name of the role?'
            },
            {
                type:'input',
                name: 'roleSalary',
                message:'What is the salary or the role?'
            },
            {
                type:'list',
                name:'roleDepartment',
                message:'Which department does the role belong to?',
                choices:departmentChoice
            }

        ]).then((answer)=>{

            db.query('INSERT INTO role SET ?', 
                {
                    title:answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id:answer.roleDepartment
                }, 
                (err, results)=>{
                    if (err) throw err;
                    console.log('\n NEW ROLE ADDED! \n')
                    init() 
                }
            );
        });
    });
};

function viewAllDepartments () {
    db.query('SELECT * FROM department ORDER BY id', (err, results)=>{
        if (err) throw err;
        console.table(results)
        init()
    });
};
    

function addDepartment () {
    inquirer.prompt([
        {
            type:'input',
            name:'departmentName',
            message:'What is the name of the department?'
        }
    ]).then((answer)=>{
        db.query(`INSERT INTO department SET department.name=?`,answer.departmentName,(err,res)=>{
            if (err) throw err;
            console.log(`\n NEW DEPARTMENT IS ADDED! \n`);
            init() ;
        });
    });
};

function quit () {
   
};

init();