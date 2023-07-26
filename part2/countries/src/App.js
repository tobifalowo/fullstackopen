import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [filterString, setfilterString] = useState('')
  const [countries, setCountries] = useState([])
  const [nofMatches, setNofMatches] = useState(null)
  const [countryIndex, setCountryIndex] = useState([])
  const [shownCountries, setShownCountries] = useState([])
  const [weatherMapping, setWeatherMapping] = useState(new Map())

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
      setShownCountries([])
    } else {
      let results = countryIndex.filter(c => c.name.common.toLowerCase().includes(str.toLowerCase()))
      const nmofMatches = results.length
      setNofMatches(nmofMatches)
      console.log("nof matches: ", nmofMatches)
      if (nmofMatches <= 10) {
        // console.log('results0:', results[0].name)
        setCountries(results)
        if (nmofMatches === 1) {
          fetchWeather(results[0])
        }
      } else {
        setCountries([])
        setShownCountries([])
      }
    }
  }

  const handleFilterChange = (event) => {
    setfilterString(event.target.value)
    updateCountries(event.target.value)
  }

  const showCountry = (commonName) => {
    if (!shownCountries.includes(commonName)) {
      setShownCountries(shownCountries.concat(commonName))
      fetchWeather(countries.find(c => c.name.common === commonName))
    } else {
      setShownCountries(shownCountries.filter(n => n !== commonName))
    }
  }

  const fetchWeather = (country) => {
    const name = country.name.common
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]

    console.log('lat', lat)
    console.log('lon', lon)

    if (!weatherMapping.has(country.name.common)) {
      weatherService
        .getWeather(lat, lon)
        .then(weather => {
          console.log('Fetching weather for: ', country)
          console.log('Fetched weather: ', weather)
          let copy = new Map(weatherMapping)
          copy.set(country.name.common, weather)
          setWeatherMapping(copy)
        })
        .catch(error => {
          console.log('Failed to acquire weather data', error)
        })
    }
  }

  return (
    <div>
      <Filter filterString={filterString} onChange={handleFilterChange} />
      <CountryList countries={countries} nofMatches={nofMatches} show={showCountry} shownCountries={shownCountries} weatherMapping={weatherMapping} />
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
    const country = props.countries[0]
    return(
      <SoleCountry country={country} weather={props.weatherMapping.get(country.name.common)} />
    )
  } else {
    return(
      <div>
        {props.countries.map(country =>
          <Country country={country} key={country.name.common} show={props.show} isShown={props.shownCountries.includes(country.name.common)} weather={props.weatherMapping.get(country.name.common)} />)
        }
      </div>
    )
  }
}

const Country = ( {country, show, isShown, weather} ) => {
  if (isShown) {
    return(
      <>
        <button onClick={() => show(country.name.common)}>Show</button>
        <SoleCountry country={country} weather={weather}/>
      </>
    )
  } else {
    return (
      <li>{country.name.common} <button onClick={() => show(country.name.common)}>Show</button></li>
    )
  }
}

const SoleCountry = ( {country, weather} ) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <li>Capital: {country.capital}</li>
      <li>Area: {country.area}</li>
      <br />
      <b>Languages:</b>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}></img>
      <Weather country={country} weather={weather} />
    </div>
  )
}

const Weather = ( {country, weather} ) => {
  const capital = country.capital

  if (weather) {
    const iconCode = weather.weather[0].icon
    const description = weather.weather[0].description
    const temperature = (weather.main.temp - 273.15).toPrecision(3)
    console.log('iconCode: ', iconCode)
    console.log('description: ', description)
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <li>Temperature: {temperature} Celcius</li>
        <img src={`http://openweathermap.org/img/w/${iconCode}.png`} alt={description} />
        <li>Wind: {weather.wind.speed} m/s</li>
      </div>
    )
  }
}

export default App