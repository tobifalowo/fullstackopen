import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const submitName = (event) => {
    event.preventDefault()
    let copy = [...persons]
    console.log('newname', newName)
    copy.push({ name: newName})
    console.log('copy', copy)
    setPersons(copy)
    setNewName('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log('set name', event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={submitName}>
        <div>
          Name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <li>{person.name}</li>)}
    </div>
  )
}

export default App