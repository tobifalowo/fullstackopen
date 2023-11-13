import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

      blogService.getAll().then(blogs =>
        setBlogs( blogsSorted(blogs) )
      )
    }
  }, [])

  const blogsSorted = (blogs) => {
    return [...blogs].sort((a,b) => b.likes - a.likes)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    blogService.getAll().then(blogs =>
      setBlogs( blogsSorted(blogs) )
    )
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs( blogsSorted(blogs.concat(blog)) )
      setNotification(`A new blog was added: "${blog.title}" by ${blog.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return true
    } catch (exception) {
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const likeBlog = async (blog) => {
    try {
      const id = blog.id
      const setLikes = blog.likes + 1
      const user = blog.user.id
      let copy = { ...blog, likes: setLikes, user: user }
      delete copy.id

      const updatedBlog = await blogService.update(id, copy)
      setBlogs( blogsSorted([...blogs].map(blog => blog.id === id ? updatedBlog : blog)) )
      setNotification(`Blog was liked: "${blog.title}" by ${blog.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return true
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Failed to like blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const deleteBlog = async (blog) => {
    try {
      const id = blog.id

      if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
        await blogService.deleteEntry(id)
        setBlogs( blogs.filter(b => b.id !== id) )
        setNotification(`Blog was removed: "${blog.title}" by ${blog.author}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        return true
      }
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Failed to remove blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to Application</h2>
      <Notification message={errorMessage} />
      <div>
        Username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">Login</button>
    </form>
  )

  const blogList = () => (
    <>
      <h2>Blogs</h2>
      {errorMessage && <Notification message={errorMessage} />}
      {notification && <Notification message={notification} color='green'/>}
      <div>
        {`${user.name} logged in`}
        <br/>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <br/>
      <Togglable buttonLabel='New Note' ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} />
      )}
    </>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        blogList()
      }
    </div>
  )
}

const Notification = ({ message, color='red' }) => {
  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return (
    <div className='error' style={notificationStyle}>
      {message}
    </div>
  )
}

export default App