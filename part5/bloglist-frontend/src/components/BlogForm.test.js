import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import BlogForm from './BlogForm'

describe ('<BlogForm />', () => {
  let createdBlog

  const createBlog = async ({ title, author, url }) => {
    createdBlog = { title, author, url }
  }

  beforeEach(() => {
    render(
      <BlogForm createBlog={createBlog} />
    ).container
  })

  test('calls the event handler with the correct details from the form', async () => {
    const blog = {
      title: 'Donuts Explained',
      author: 'Homer Simpson',
      url: 'http://www.blogger.xyz/homer/donuts',
    }

    const user = userEvent.setup()
    await act( async () => {
      let input
      input = screen.getByRole('textbox', { name: /title/i })
      await userEvent.type(input, blog.title)
      input = screen.getByRole('textbox', { name: /author/i })
      await userEvent.type(input, blog.author)
      input = screen.getByRole('textbox', { name: /url/i })
      await userEvent.type(input, blog.url)

      const createButton = screen.getByText('Create')
      await user.click(createButton)
    })

    expect(createdBlog.title).toEqual(blog.title)
    expect(createdBlog.author).toEqual(blog.author)
    expect(createdBlog.url).toEqual(blog.url)
  })

})