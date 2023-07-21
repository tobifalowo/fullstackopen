import { useState, useEffect } from 'react'
import countryService from './services/countries'

const App = () => {
  const [filterString, setfilterString] = useState('')
  const [countries, setCountries] = useState([])
  const [nofMatches, setNofMatches] = useState(null)
  const [countryIndex, setCountryIndex] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setCountryIndex(countries)
        console.log('CountryIndex', countries)
        updateCountries(filterString)
      })
  }, [])

  const updateCountries = (str) => {
    if (str === '') {
      setNofMatches(null)
      setCountries([])
    } else {
      const results = countryIndex.filter(c => c.name.common.toLowerCase().includes(str.toLowerCase()))
      const nmofMatches = results.length
      setNofMatches(nmofMatches)
      console.log("nof matches: ", nmofMatches)
      if (nmofMatches <= 10) {
        // console.log('results0:', results[0].name)
        setCountries(results)
      } else {
        setCountries([])
      }
    }
  }

  const handleFilterChange = (event) => {
    setfilterString(event.target.value)
    updateCountries(event.target.value)
  }

  return (
    <div>
      <Filter filterString={filterString} onChange={handleFilterChange} />
      <CountryList countries={countries} nofMatches={nofMatches} />
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>Find countries: <input value={props.filterString} onChange={props.onChange}/></div>
  )
}

const CountryList = (props) => {
  if (props.nofMatches > 10) {
    return(
      <div>Too many matches, specify another filter</div>
    )
  } else if (props.nofMatches === 1) {
    return(
      <SoleCountry country={props.countries[0]} />
    )
  } else {
    return(
      <div>
        {props.countries.map(country => <Country country={country} key={country.name.common}/>)}
      </div>
    )
  }
}

const Country = ( {country} ) => {
  console.log('country: ', country)
  return (
    <li key={country.id}>{country.name.common}</li>
  )
}

const SoleCountry = ( {country} ) => {
  console.log('country: ', country)
  console.log('country l: ', country.languages)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <li>Capital: {country.capital}</li>
      <li>Area: {country.area}</li>
      <br />
      <b>Languages:</b>
      <ul>
        {Object.values(country.languages).map(lang => <li>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}></img>
    </div>
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