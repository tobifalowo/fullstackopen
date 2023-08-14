import { useState } from 'react'

const Blog = ({blog, likeBlog}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = (event) => {
    event.preventDefault()
    setVisible(!visible)
  }

  const clickLike = async (event) => {
    event.preventDefault()
    await likeBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}&nbsp;
        <button onClick={toggleVisibility} style={hideWhenVisible}>View</button>
        <button onClick={toggleVisibility} style={showWhenVisible}>Hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}
        <br/>
        Likes: {blog.likes}&nbsp;
        <button onClick={clickLike}>Like</button>
        <br/>
        {blog.user && blog.user.name}
      </div>
    </div>
  )
}

export default Blog