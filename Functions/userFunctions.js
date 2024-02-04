import axios from 'axios';

export async function createUser(name, email, password) {
  try {
    const response = await axios.post('http://127.0.0.1:3000/users', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function fetchAllUsers() {
  try {
    const response = await axios.get('http://127.0.0.1:3000/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
