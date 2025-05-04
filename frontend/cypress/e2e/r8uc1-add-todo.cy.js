describe('R8UC1 - se if tasks exists', () => {
   
    // define variables that we need on multiple occasions
        let uid // user id
        let name // name of the user (firstName + ' ' + lastName)
        let email // email of the user
        let tasks

    before(() => {
        cy.clearAllCookies()
        cy.log('Step 1: Setup initial state');
        // Example: Create a user
        cy.fixture('user2.json').then((user) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/users/create',
                form: true,
                body: user
              }).then((response) => {
                uid = response.body._id.$oid
                name = user.firstName + ' ' + user.lastName
                email = user.email

                cy.visit('http://localhost:3000')
                cy.contains('div', 'Email Address').find('input[type=text]').type('user.doe@gmail.com')
                    cy.get('form').submit()
                });
                cy.fixture('task.json')
                .then((task) => {
                    cy.get('input#title')
                    .type(task.title);

                    cy.get('input#url')
                    .type(task.description); // Use a valid YouTube viewkey

                    cy.get('form.submit-form').submit();
                })
            })
    })
    beforeEach(function()  {
        cy.clearCookies();  // Clear cookies before the test runs
        cy.clearLocalStorage();
        cy.visit('http://localhost:3000')
        cy.contains('div', 'Email Address').find('input[type=text]').type('user.doe@gmail.com')
            cy.get('form').submit()
        cy.get('.container-element').first().click();
    })
    
    it('R8UC1_1: text input', () => {
        // Now assert that the form with the text input appears
        cy.get('form.inline-form')
          .should('exist')
          .within(() => {
            // 1a. Input type text exists
            cy.get('input[type="text"]').should('exist');
            // 1b. Submit button "Add" exists
            cy.get('input[type="submit"]').should('exist');
            // 1c. Submit button "Add" is inactive (disabled)
            cy.get('input[type="submit"]').should('be.disabled');
          });
    });

    it('R8UC1_2: button is anables after keyboard input in the text field', () => {
        cy.get('form.inline-form')
          .should('exist')
          .within(() => {
            
            cy.get('input[type="text"]').type('new task');
            
            cy.get('input[type="submit"]').should('not.be.disabled');;
          });
    });

    it('R8UC1_3: batton adds a new todo item and asserts it appears in the list', () => {      
        // First, count the initial number of todo items (excluding the form)
        cy.get('ul.todo-list > li.todo-item').then($items => {
            const initialCount = $items.length;
        
            // Add new todo
            const newTodoText = 'A new todo';
            cy.get('form.inline-form input[type="text"]').type(newTodoText);
            cy.get('form.inline-form input[type="submit"]').click();
        
            // Assert that number of items increased by 1
            cy.get('ul.todo-list > li.todo-item')
            .should('have.length', initialCount + 1);
        
            // Assert that one of the items contains the new todo text
            cy.get('ul.todo-list > li.todo-item')
            .last()
            .should('contain.text', newTodoText);
        });          
    });

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
