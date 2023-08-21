import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe ('<Blog />', () => {
  let container

  const blog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
    likes: 59,
    user: {
      username: 'test',
      name: 'Test Tester'
    }
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} />
    ).container
  })

  test('renders title and author', () => {
    screen.getByText(`${blog.title} ${blog.author}`)
  })

  test('does not render URL or number of likes by default', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(`${blog.url}`)
    expect(div).toHaveTextContent(`Likes: ${blog.likes}`)

    let element = screen.queryByText(`${blog.url}`, { exact: false })
    expect(element).not.toBeVisible()
    element = screen.queryByText('Likes: ', { exact: false })
    expect(element).not.toBeVisible()
    element = screen.queryByText(`${blog.likes}`, { exact: false })
    expect(element).not.toBeVisible()
  })

  test('renders URL and number when button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    let element = screen.queryByText(`${blog.url}`, { exact: false })
    expect(element).toBeVisible()
    element = screen.queryByText(`Likes: ${blog.likes}`, { exact: false })
    expect(element).toBeVisible()
  })
})