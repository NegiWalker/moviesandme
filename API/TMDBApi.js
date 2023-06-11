// API/TMDBApi.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_TOKEN = "e3645578be8afa91bd0d62105075a890";

const getImageFromApi = (name) => {
  if (name === null || name === undefined || name.length == 0)
    return require('../Assets/filmVide.png')
  const uri = 'https://image.tmdb.org/t/p/w300' + name
  return { uri: uri }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
async function slowNetwork() {
  await sleep(500)
}

const getFilmsFromApiWithSearchedText = async (text, page) => {
  await slowNetwork()
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text + "&page=" + page
  const response = await axios.get(url)
  console.log('--getFilmsFromApiWithSearchedText--')
  console.log(response.data)
  console.log('--fin getFilmsFromApiWithSearchedText--')

  let i = 0;
  response.data.results.forEach(function (part, index) {
    this[index].listId = uuidv4() + page + i++;
  }, response.data.results);
  return response.data;
}

export default  getFilmsFromApiWithSearchedText 
export { getFilmsFromApiWithSearchedText, getImageFromApi }
