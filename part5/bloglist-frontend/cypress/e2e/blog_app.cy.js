describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    const user2 = {
      name: 'Pelle Peloton',
      username: 'ppeloton',
      password: 'lamppu1'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
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

      it('A blog can be deleted', function() {
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

      it('Only created can see the delete button', function() {
        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('zxy')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('.blog div:first').contains('zxy')
        cy.get('button').contains('View').click()
        cy.get('button').contains('Delete')

        cy.get('button').contains('Logout').click()
        cy.get('#username').type('ppeloton')
        cy.get('#password').type('lamppu1')
        cy.get('#login-button').click()

        cy.get('.blog div:first').contains('zxy')
        cy.get('button').contains('View').click()
        cy.get('button').contains('Delete').should('not.exist')
      })

      it.only('Blogs are sorted by likes', function() {
        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('aaa')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('ccc')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('button').contains('New Note').click()
        cy.get('[aria-label="title"]').type('bbb')
        cy.get('[aria-label="author"]').type('bcd')
        cy.get('[aria-label="url"]').type('cde')
        cy.get('button').contains('Create').click()

        cy.get('.blog').eq(0).should('contain', 'aaa')
        cy.get('.blog').eq(1).should('contain', 'ccc')
        cy.get('.blog').eq(2).should('contain', 'bbb')

        cy.get('.blog').eq(2).within(() => {
          cy.get('button').contains('View').click()
          cy.get('button').contains('Like').click()
        })

        cy.get('.blog').eq(0).contains('Likes: 1')
        cy.get('.blog').eq(0).contains('bbb')
        cy.get('.blog').eq(1).should('contain', 'aaa')
        cy.get('.blog').eq(2).should('contain', 'ccc')

        cy.get('.blog').eq(2).within(() => {
          cy.contains('ccc')
          cy.get('button').contains('View').click()
          cy.get('button').contains('Like').click()
        })
        cy.get('.blog').eq(0).contains('Likes: 1')
        cy.get('.blog').eq(0).contains('bbb')
        cy.get('.blog').eq(1).should('contain', 'ccc')
        cy.get('.blog').eq(1).contains('Likes: 1')
        cy.get('.blog').eq(2).should('contain', 'aaa')

        cy.get('button').contains('Logout').click()
        cy.get('#username').type('ppeloton')
        cy.get('#password').type('lamppu1')
        cy.get('#login-button').click()

        cy.get('.blog').eq(0).should('contain', 'ccc')
        cy.get('.blog').eq(0).within(() => {
          cy.get('button').contains('View').click()
        })
        cy.get('.blog').eq(1).within(() => {
          cy.get('button').contains('View').click()
        })

        cy.get('.blog').eq(0).should('contain', 'ccc')
        cy.get('.blog').eq(0).contains('Likes: 1')
        cy.get('.blog').eq(1).contains('Likes: 1')
        cy.get('.blog').eq(1).should('contain', 'bbb')
        cy.get('.blog').eq(2).should('contain', 'aaa')

        cy.get('.blog').eq(1).within(() => {
          cy.get('button').contains('Like').click()
        })
        cy.get('.blog').eq(0).should('contain', 'bbb')
        cy.get('.blog').eq(0).contains('Likes: 2')
      })
    })
  })
})