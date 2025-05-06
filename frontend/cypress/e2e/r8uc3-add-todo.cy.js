describe('R8UC3 - Add todo item3', () => {
    
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user
    let todoLength

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

        cy.get('img').last().click();         
    })

    it('R8UC3_1: x symbol behind the description of the todo item', () => {
        cy.get('ul.todo-list > li.todo-item').last() 
        // Ensure the "x" symbol exists behind the description (positioned properly)
        .find('.remover')
        .should('exist')
    })
    
    it('R8UC3_2: The todo item is removed from the todo list', () => {
        cy.get('ul.todo-list > li.todo-item').then($items => {
            const initialCount = $items.length;
           
            cy.get('.remover').should('exist')
            .dblclick({ force: true });
            
            cy.get('ul.todo-list > li.todo-item')
            .should('have.length', initialCount - 1);
        });

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
