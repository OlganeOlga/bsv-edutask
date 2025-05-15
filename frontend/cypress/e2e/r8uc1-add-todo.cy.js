describe('R8UC1 - se if tasks exists', () => {
   
  // define variables that we need on multiple occasions
      let uid // user id
      let email // email of the user

  before(() => {
      cy.clearAllCookies()
      cy.log('Step 1: Setup initial state');
      // Example: Create a user
      cy.fixture('user.json').then((user) => {
          cy.request({
              method: 'POST',
              url: 'http://localhost:5000/users/create',
              form: true,
              body: user
            }).then((response) => {
              uid = response.body._id.$oid
              email = user.email

              cy.visit('http://localhost:3000');
              cy.contains('div', 'Email Address').find('input[type=text]').type(email);
              cy.get('form').submit();
        
              cy.fixture('task.json').then((task) => {
                cy.get('input#title').type(task.title);
                cy.get('input#url').type(task.description);
                cy.get('form.submit-form').submit();
              });
        });
    });
  });


  beforeEach(function()  {
    cy.visit('http://localhost:3000');
    cy.contains('div', 'Email Address').find('input[type=text]').type(email);
    cy.get('form').submit();

    // click img
    cy.get('img').first().click();
  })
  
  it('R8UC1_1a: text input', () => {
    cy.get('*').filter((index, el) => {
      return [...el.attributes].some(attr => attr.name.includes('todo') || attr.value.includes('todo'));
    }).find('form').within(() => {
      cy.get('input[type="text"]').should('exist');
    });
  });

  it('R8UC1_1b: submit button exists', () => {
    cy.get('*').filter((index, el) => {
      return [...el.attributes].some(attr => attr.name.includes('todo') || attr.value.includes('todo'));
    }).find('form').within(() => {
      cy.get('input[type="submit"]').should('exist');
    });
  });


  it('R8UC1_1c: text input empty and submit is disabled', () => {
    cy.get('*').filter((index, el) => {
      return [...el.attributes].some(attr => attr.name.includes('todo') || attr.value.includes('todo'));
    }).find('form').within(() => {
      cy.get('input[type="submit"]').should('be.disabled');
    });
  });

  it('R8UC1_2: button is anables after keyboard input in the text field', () => {
    cy.get('*').filter((index, el) => {
      return [...el.attributes].some(attr => attr.name.includes('todo') || attr.value.includes('todo'));
    }).find('form').within(() => {
      cy.get('input[type="text"]').type('new task');
      
      cy.get('input[type="submit"]').should('not.be.disabled');
    });
  });

  it('R8UC1_3: batton adds a new todo item and asserts it appears in the list', () => { 
    //cy.get('ul.todo-list > li.todo-item')
    cy.get('*').filter((index, el) => {
      return [...el.attributes].some(attr => attr.name.includes('item') || attr.value.includes('item'));
    })
    .then($items => {
        const initialCount = $items.length;
        cy.log(`todo-list of length: ${initialCount}`)
    
        // Add new todo
        const newTodoText = 'A new todo';
        cy.get('form.inline-form input[type="text"]').type(newTodoText);
        cy.get('form.inline-form input[type="submit"]').click();
    
        // Assert that number of items increased by 1
        cy.get('.todo-list > .todo-item')
        .should('have.length', initialCount + 1);
    
        // Assert that one of the items contains the new todo text
        cy.get('.todo-list > .todo-item')
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
