import axios from 'axios';
const API_Key = '30101192-873c73f6b4dfe5f82ebfe07cf';
const serchParam = new URLSearchParams({
  key: API_Key,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});

export const BASE_URL = `https://pixabay.com/api/?${serchParam}`;

export async function getPhoto(search) {
  try {
    const response = await axios.get(`${BASE_URL}&q=${search}`);
    return response.data;
  } catch (error) {
    alert('Erooor');
  }
}
