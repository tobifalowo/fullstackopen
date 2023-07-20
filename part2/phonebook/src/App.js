import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setfilterString] = useState('')

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

  const handleFilterChange = (event) => {
    setfilterString(event.target.value)
  }

  const shownPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterString.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterString={filterString} onChange={handleFilterChange} />
      <h2>Add Number</h2>
      <PersonForm
        submit={submitName}
        name={newName}
        nameChange={handleNameChange}
        number={newNumber}
        numberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={shownPersons}/>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>Filter shown with: <input value={props.filterString} onChange={props.onChange}/></div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submit}>
      <div>Name: <input value={props.name} onChange={props.nameChange}/></div>
      <div>Number: <input value={props.number} onChange={props.numberChange}/></div>
      <div><button type="submit">Add</button></div>
    </form>
  )
}

const Persons = (props) => {
  return (
    props.persons.map(person => <Person person={person} />)
  )
}

const Person = (props) => {
  const person = props.person
  return (
    <li>{person.name} {person.number}</li>
  )
}

export default App