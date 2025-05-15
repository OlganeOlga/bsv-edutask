describe('R8UC2 - Add todo item2', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let email // email of the user

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
                email = user.email

            })
        })
    })

    beforeEach(function()  {
        cy.visit('http://localhost:3000')
        cy.contains('div', 'Email Address').find('input[type=text]').type(email)
        cy.get('form').submit();
        cy.fixture('task.json')
        .then((task) => {
            cy.get('input#title')
            .type(task.title);

            cy.get('input#url')
            .type(task.description); // Use a valid YouTube viewkey

            cy.get('form.submit-form').submit();
            // click img
            cy.get('img').last().click();
        });
    })

    afterEach(function() {
        cy.request({
            method: 'GET',
            url: `http://localhost:5000/tasks/ofuser/${uid}`
            }).then((response) => {
            expect(response.status).to.eq(200);
            const tasks = response.body;
            cy.log(`User has ${tasks.length} task(s)`);

            // Loop through tasks and delete each by ID
            tasks.forEach(task => {
                cy.request({
                method: 'DELETE',
                url: `http://localhost:5000/tasks/byid/${task._id.$oid}`, // adapt if not using MongoDB-like ID
                }).then((deleteRes) => {
                expect(deleteRes.status).to.eq(200);
                expect(deleteRes.body.success).to.be.true;
                cy.log(`Deleted task with id: ${task._id.$oid}`);
                });
            });
        });
    })

    
    it('R8UC2_1: Test icon in front of the description of the todo item', () => {
        cy.get('.todo-list').should('exist'); // or cy.get('.popup').should('exist');
        // Now continue with assertions
        cy.get('.todo-list > .todo-item').last().find('.checker').should('exist');
    })
    
    
    it('R8UC2_2a: Todo item set to done', () => {       
        // Click the icon
        cy.get('.todo-list > .todo-item')
            .first()
            .find('.checker')
            .click();
        
        // Assert the todo item is now marked as done
        cy.get('.todo-list > .todo-item')
            .first()
            .find('.checker')
            .should('have.class', 'checked');
    })

    it('R8UC2_2b: Todo item set to done - text is struck throw', () => {
        // Click the icon
        cy.get('.todo-list > .todo-item')
            .first()
            .find('.checker')
            .click();
               
        cy.get('ul.todo-list > li.todo-item')
            .last()
            .find('.editable')
            .should('have.css', 'text-decoration-line', 'line-through');
    })


    it('R8UC2_3a: Todo item set to active after the second click', () => { 
         // Click the icon second time
        cy.get('ul.todo-list > li.todo-item')
         .last()
         .find('.checker')
         .click();
        
        // Assert the todo item is not marked as done
        cy.get('ul.todo-list > li.todo-item')
            .last()
            .find('.checker')
            .should('have.class', 'unchecked');
    })

    
    it('R8UC2_3b: Text of the item is not struck trow after the second click', () => { 
        cy.get('ul.todo-list > li.todo-item')
           .last()
           .find('.editable')        // adjust selector if needed
           .should('not.have.css', 'text-decoration-line', 'line-through');
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
