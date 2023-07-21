import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setfilterString] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const submitName = (event) => {
    event.preventDefault()
    let copy = [...persons]
    console.log('newname', newName)
    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setNewName('')
      setNewNumber('')

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
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

  const deletePerson = (id) => {
    const name = persons.find(person => person.id === id).name
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deleteEntry(id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
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
      <Persons persons={shownPersons} remove={deletePerson}/>
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
    props.persons.map(person => <Person person={person} key={person.name} remove={props.remove}/>)
  )
}

const Person = (props) => {
  const person = props.person
  return (
    <li>{person.name} {person.number} <button onClick={() => props.remove(person.id)}>Delete</button></li>
  )
}

export default App