import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5'
const api_key = process.env.REACT_APP_API_KEY

const getWeather = (lat, lon) => {
  const request = axios.get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
  return request.then(response => response.data)
}

export default { 
  getWeather
}