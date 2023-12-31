import axios from 'axios'
// const baseUrl = 'http://localhost:3001/persons'
// compatability with Part 3
// const baseUrl = 'http://localhost:3001/api/persons'
// compatability with production build
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteEntry = (id) => {
  console.log('deleting', id)
  return axios.delete(`${baseUrl}/${id}`)
}

export default { 
  getAll,
  create,
  update,
  deleteEntry
}