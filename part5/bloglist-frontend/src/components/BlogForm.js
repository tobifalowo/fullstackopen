import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const res = await createBlog({ title, author, url })
    if (res) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:&nbsp;
          <input
            type="text"
            value={title}
            aria-label="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author:&nbsp;
          <input
            type="text"
            value={author}
            aria-label="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL:&nbsp;
          <input
            type="text"
            value={url}
            aria-label="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>

    </>
  )
}

export default BlogForm