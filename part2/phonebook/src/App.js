import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setfilterString] = useState('')
  const [noteMessage, setNoteMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        applyError(`Failed to retrieve initial persons`)
      })
  }, [])

  const submitName = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)) {
      const id = persons.find(person => person.name === newName).id
      if (window.confirm(
        `${newName} is already added to phonebook. Replace the old number with a new one?`
      )) {
        personService
          .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
            applyNote(`Updated ${newName}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            applyError(error.response.data.error)
            refreshPersons()
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          applyNote(`Added ${newName}`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          applyError(error.response.data.error)
          refreshPersons()
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
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
          applyNote(`Deleted ${name}`)
        })
        .catch(error => {
          applyError(`Failed to delete ${name}`)
          refreshPersons()
        })
    }
  }

  const applyNote = (str) => {
    setNoteMessage(str)
    setTimeout(() => {
      setNoteMessage(null)
    }, 3000)
  } 

  const applyError = (str) => {
    setErrorMessage(str)
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const refreshPersons = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }

  const shownPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterString.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={'red'} />
      <Notification message={noteMessage} color={'green'} />
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
    props.persons.map(person => <Person person={person} key={person.id} remove={props.remove}/>)
  )
}

const Person = (props) => {
  const person = props.person
  return (
    <li>{person.name} {person.number} <button onClick={() => props.remove(person.id)}>Delete</button></li>
  )
}

const Notification = ({ message, color }) => {
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