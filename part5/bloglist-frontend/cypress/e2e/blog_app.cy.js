describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to Application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('samainen')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
    })
  })

  describe('Blog app', function() {
    describe('When logged in', function() {
      beforeEach(function() {
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
  
        cy.contains('Matti Luukkainen logged in')
      })

      it('A blog can be created', function() {
        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('abc')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('.error').contains('A new blog was added')
        cy.get('.blog div:first').contains('abc')
      })
    })
  })
})