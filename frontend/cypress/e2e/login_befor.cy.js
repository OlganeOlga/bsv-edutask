describe('Logging into the system', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user
  let tasks // tasks of the user

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture('user2.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email
        })
      })

   
  })

  beforeEach(function () {
    cy.clearCookies();  // Clear cookies before the test runs
    cy.clearLocalStorage();  // Optionally clear local storage as well
    // enter the main main page
    cy.visit('http://localhost:3000')
    cy.contains('div', 'Email Address')
    .find('input[type=text]')
      .type(email)
    cy.get('form')
      .submit()
    cy.fixture('task.json')
      .then((task) => {
        cy.get('input#title')
          .type(task.title);

        cy.get('input#url')
          .type(task.description); // Use a valid YouTube viewkey

        cy.get('form.submit-form').submit();
      })
  })


  it('login to the system with an existing account', () => {
    // detect a div which contains "Email Address", find the input and type (in a declarative way)
    
      
    // alternative, imperative way of detecting that input field
    //cy.get('.inputwrapper #email')
    //    .type(email)

    // submit the form on this page
    

    // // assert that the user is now logged in
    // cy.get('h1')
    //   .should('contain.text', 'Your tasks, ' + name)

      
  })

  // it('email field enabled', ()=> {
  //   cy.get('inputwrapper #email')
  //     .should('be.disabled')
  // })

  afterEach(function () {
    cy.log(uid)
    cy.request({
      method: 'GET',
      url: `http://localhost:5000/user/${uid}`
    }).then((response) => {
      // Check the response structure in the console log
      cy.log(JSON.stringify(response.body));
      // Assuming the tasks are inside response.body (adjust if necessary)
      tasks = response.body.tasks || []; // or just `response.body` if it's directly an array

      if (tasks && tasks.length > 0) {
        tasks.forEach(taskId => {
          cy.request({
            method: 'DELETE',
            url: `http://localhost:5000/tasks/byid/${taskId}`
          }).then((response) => {
            cy.log(`Deleted task ${taskId}:`, response.body)
          })
        })
      }
    })
  })

  after(function () {
    // clean up by deleting the user from the database 
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})