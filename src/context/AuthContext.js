import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { username, password });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (username, email, password, age, dob, contact, gender) => {
    try {
      await axios.post('http://localhost:5000/api/users/register', { username, email, password, age, dob, contact, gender });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const storedToken = localStorage.getItem('token'); 
      // console.log('Fetched token:', storedToken);
  
      const { data } = await axios.get('http://localhost:5000/api/users/me', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
  
      // console.log('Fetched user data:', data);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error.response ? error.response.data : error.message);
      setUser(null);
    }
  };
  

  const updateUser = async (userData) => {
    // console.log('Sending user data for update:', userData); 
    try {
      const response = await axios.put('http://localhost:5000/api/users/update', userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // console.log('User updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, fetchUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
