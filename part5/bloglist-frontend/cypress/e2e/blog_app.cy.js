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

      it('A blog can be liked', function() {
        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('zxy')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('.blog div:first').contains('zxy')
        cy.get('button').contains('View').click()
        cy.get('button').contains('Like').click()
        cy.get('.blog').contains('Likes: 1')
      })

      it.only('A blog can be deleted', function() {
        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('zxy')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('.blog div:first').contains('zxy')
        cy.get('button').contains('View').click()
        cy.get('button').contains('Delete').click()
        cy.get('.error').contains('Blog was removed')
        cy.get('.blog div:first').contains('zxy').should('not.exist')
      })
    })
  })
})