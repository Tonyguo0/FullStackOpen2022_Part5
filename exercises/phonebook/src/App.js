import { useState, useEffect } from 'react'
import personsService from './services/persons'

const Filter = ({ newFilter, Change }) => {
  return (
    <div>
      filter shown with{' '}
      <input
        value={newFilter}
        onChange={Change}
      />
    </div>
  )
}

const PersonForm = ({ Name, PN, ChangeName, ChangePN, handleButton }) => {
  return (
    <form>
      <div>
        name:{' '}
        <input
          value={Name}
          onChange={ChangeName}
        />
      </div>
      <div>
        number{' '}
        <input
          value={PN}
          onChange={ChangePN}
        />
      </div>
      <div>
        <button
          onClick={handleButton}
          type='submit'>
          add
        </button>
      </div>
    </form>
  )
}

const Persons = ({ Filter, List, setList }) => {
  const handleButton = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }
    personsService
      .deletePerson(person.id)
      .then(() => {
        setList(
          List.filter((thisperson) => {
            return thisperson.id !== person.id
          })
        )
      })
      .catch((error) => {
        alert(
          `the note '${person.name} was already deleted from server
        \n error message is: ${error.message}
        `
        )
      })
  }
  const filteredpersons =
    Filter === ''
      ? List
      : List.filter((person) =>
          person.name.toLowerCase().includes(Filter.toLowerCase())
        )
  return (
    <div>
      {filteredpersons.map((person) => {
        return (
          <div key={person.id}>
            {person.name} {person.number}{' '}
            <button
              onClick={() => {
                handleButton(person)
              }}>
              delete
            </button>
          </div>
        )
      })}
    </div>
  )
}

const NormalNotification = ({ newNotification }) => {
  if (newNotification === null) {
    return null
  }

  const notificationstyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return <div style={notificationstyle}>{newNotification}</div>
}

const WarningNotification = ({ newNotification }) => {
  if (newNotification === null) {
    return null
  }

  const notificationstyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return <div style={notificationstyle}>{newNotification}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPN, setPN] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newNotification, setNewNotification] = useState(null)
  const [newWNotification, setNewWNotification] = useState(null)

  useEffect(() => {
    personsService.getAllPeople().then((initialPeople) => {
      setPersons(initialPeople)
    })
  }, [])

  const handleAddButton = (event) => {
    event.preventDefault()
    // compare person's name existing in the array with newName if newName already in persons array send out alert ${newName} is already added to phone book
    let currentPerson = persons.find((person) => person.name === newName)
    if (currentPerson) {
      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return
      } else {
        const changedPerson = { ...currentPerson, number: newPN }
        console.log('changedPerson', changedPerson)
        personsService
          .updatePerson(currentPerson.id, changedPerson)
          .then((thisperson) => {
            const newPhoneBook = persons.map((person) => {
              // console.log("changedPerson is:", changedPerson);
              return changedPerson.id === person.id ? changedPerson : person
            })
            // console.log(newPhoneBook);
            setNewNotification(
              `Changed ${changedPerson.name}'s number to ${changedPerson.number}`
            )
            setPersons(newPhoneBook)
            setNewName('')
            setPN('')
            setNewFilter('')
            setTimeout(() => {
              setNewNotification(null)
            }, 5000)
          })
          .catch((error) => {
            setNewWNotification(error.response.data.error)
            setTimeout(() => {
              setNewWNotification(null)
            }, 5000)
          })
      }

      return
    } else {
      const tempPerson = { name: newName, number: newPN }

      personsService
        .addPerson(tempPerson)
        .then((initialPerson) => {
          setPersons(persons.concat(initialPerson))
          setNewNotification(`Added ${newName}`)
          setTimeout(() => {
            setNewNotification(null)
          }, 5000)
          setNewName('')
          setPN('')
          setNewFilter('')
        })
        .catch((error) => {
          setNewWNotification(error.response.data.error)
          console.log(error.response.data.error)
          setTimeout(() => {
            setNewWNotification(null)
          }, 5000)
        })
    }
  }

  // useEffect(() => {
  //   console.log(persons);
  // }, [persons]);

  const handleOnChangeName = (event) => {
    setNewName(event.target.value)
  }
  const handleOnChangePN = (event) => {
    setPN(event.target.value)
  }

  const handleOnChangeFilter = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <NormalNotification newNotification={newNotification} />
      <WarningNotification newNotification={newWNotification} />

      <Filter
        newFilter={newFilter}
        Change={handleOnChangeFilter}
      />
      <h2>add a new</h2>

      <PersonForm
        Name={newName}
        PN={newPN}
        ChangeName={handleOnChangeName}
        ChangePN={handleOnChangePN}
        handleButton={handleAddButton}
      />

      <h2>Numbers</h2>
      <Persons
        Filter={newFilter}
        List={persons}
        setList={setPersons}
      />
    </div>
  )
}

export default App
