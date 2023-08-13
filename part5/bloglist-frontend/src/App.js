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
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
      setBlogs(blogs.concat(blog))
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to applicaton</h2>
      <Notification message={errorMessage} />
      <div>
        Username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
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
        <Blog key={blog.id} blog={blog} />
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