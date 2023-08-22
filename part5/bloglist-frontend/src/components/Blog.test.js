import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import Blog from './Blog'

describe ('<Blog />', () => {
  let container

  let blog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
    likes: 59,
    user: {
      username: 'test',
      name: 'Test Tester'
    }
  }

  const likeBlog = (blog) => {
    blog.likes += 1
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} likeBlog={likeBlog} />
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

    await act(async () => {
      await user.click(button)
    })

    let element = screen.queryByText(`${blog.url}`, { exact: false })
    expect(element).toBeVisible()
    element = screen.queryByText(`Likes: ${blog.likes}`, { exact: false })
    expect(element).toBeVisible()
  })

  test('calls provided event handler twice if like button is clicked twice', async () => {
    const user = userEvent.setup()
    const initialLikes = blog.likes
    let likeButton
    await act(async () => {
      const viewButton = screen.getByText('View')
      await user.click(viewButton)
      likeButton = screen.getByText('Like')
      await user.click(likeButton)
    })
    expect(blog.likes).toEqual(initialLikes+1)
    await act(async () => {
      await user.click(likeButton)
    })
    expect(blog.likes).toEqual(initialLikes+2)
    blog.likes = initialLikes
  })
})