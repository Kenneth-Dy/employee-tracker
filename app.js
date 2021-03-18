const { createConnection } = require('mysql2')
const { prompt } = require('inquirer')
require('console.table')

const db = createConnection('mysql://root:rootroot@localhost/employees_db')

const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: ['View Employees', 'View Roles', 'View Departments', 'Add Departments', 'Add Roles', 'Add Employees',
      'Update Employee Role', 'Exit']
    }
  ])
    .then(({ action }) => {
      switch(action) {
        case 'View Employees':
          viewEmployees()
          break
        case 'View Roles':
          viewRoles()
          break
        case 'View Departments':
          viewDepartments()
          break
        case 'Add Departments':
          addDepartment()
          break
        case 'Add Roles':
          addRole()
          break
        case 'Add Employees':
          addEmployee()
          break
        case 'Update Employee Role':
          updateRole()
          break
        case 'Exit':
          process.exit()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewEmployees = () => {
    db.query(`SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name, roles.title, roles.salary,
  departments.name AS 'department', CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON manager.id = employees.manager_id;`, (err, company) => {
    if(err) {console.log(err)}
    console.table(company)
    mainMenu()
  })
}

const viewRoles = () => {
  db.query(`SELECT title, salary FROM roles`, (err, positions) => {
    if(err) {console.log(err)}
    console.table(positions)
    mainMenu()
  })
}

const viewDepartments = () => {
  db.query(`SELECT name FROM departments`, (err, depts) => {
    if (err) { console.log(err) }
    console.table(depts)
    mainMenu()
  })
}

const addDepartment = () => {
  prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter new department name:'
    }
  ])
    .then(name => {
      db.query('INSERT INTO departments SET ?', name, err => {
        if(err) {console.log(err)}
        console.log('Department Added!')
        mainMenu()
      })
    })
    .catch(err => console.log(err))
}

const addRole = () => {
  db.query('SELECT * FROM departments', (err, depts) => {
    if(err) { console.log(err)}

    prompt([
      {
        type: 'list',
        name: 'chosenDept',
        message: 'Pick a department for new role:',
        choices: depts.map( data => ({
          name: data.name,
          value: data.id 
        }))
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter title for new role:'
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter salary for new role:'
      }
    ])
      .then(res => {
        let newRole = {
          title: res.name,
          salary: res.salary,
          department_id: res.chosenDept
        }
        console.log(newRole)
        db.query('INSERT INTO roles SET ?', newRole, err => {
          if (err) { console.log(err) }
          console.log('Role Added!')
          mainMenu()
        })
      })
      .catch(err => console.log(err))
  })
}

const addEmployee = () => {
  db.query(`SELECT employees.id AS 'employeeID', CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`,(err, employees) => {
    if(err) { console.log(err) }
    db.query(`SELECT * FROM roles`, (err, roles) => {
      prompt([
        {
          type: 'input',
          name: 'fname',
          message: `Enter employee's first name:`
        },
        {
          type: 'input',
          name: 'lname',
          message: `Enter employee's last name:`
        },
        {
          type: 'list',
          name: 'role',
          message: 'Choose their role:',
          choices: roles.map(data => ({
            name: data.title,
            value: data.id
          }))
        },
        {
          type: 'confirm',
          name: 'bool',
          message: 'Does the employee have a manager?'
        },
        {
          type: 'list',
          name: 'manager',
          message: `Choose the employee's manager:`,
          when: function (answers) { return answers.bool },
          choices: employees.map( data => ({
            name: data.name,
            value: data.employeeID
          }))
        }
      ])
        .then(res => {
          let newEmployee = {
            first_name: res.fname,
            last_name: res.lname,
            role_id: res.role,
            manager_id: res.manager || null
          }

          db.query('INSERT INTO employees SET ?', newEmployee, err => {
            if (err) { console.log(err) }
            console.log('Employee Added!')
            mainMenu()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

const updateRole = () => {
  db.query(`SELECT id, CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`, (err, employees) => {
    if (err) { console.log(err) }
    db.query(`SELECT * FROM roles`, (err, roles) => {
      prompt([
        {
          type: 'list',
          name: 'employeeID',
          message: `Choose the employee who's role will updated:`,
          choices: employees.map(data => ({
            name: data.name,
            value: data.id
          }))
        },
        {
          type: 'list',
          name: 'roleID',
          message: `Choose their updated role:`,
          choices: roles.map(data => ({
            name: data.title,
            value: data.id
          }))
        }
      ])
        .then(res => {
          db.query('UPDATE employees SET role_id = ? WHERE id = ?', [res.roleID, res.employeeID], err => {
            if (err) { console.log(err) }
            console.log("Role Updated!")
            mainMenu()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

mainMenu()