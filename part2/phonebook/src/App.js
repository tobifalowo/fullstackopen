import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const submitName = (event) => {
    event.preventDefault()
    let copy = [...persons]
    console.log('newname', newName)
    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      copy.push({ name: newName, number: newNumber})
      console.log('copy', copy)
      setPersons(copy)
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log('set name', event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    console.log('set number', event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={submitName}>
        <div>Name: <input value={newName} onChange={handleNameChange}/></div>
        <div>Number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div><button type="submit">Add</button></div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <li>{person.name} {person.number}</li>)}
    </div>
  )
}

export default App