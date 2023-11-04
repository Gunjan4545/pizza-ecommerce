import React, { useState } from 'react';
import axios from 'axios';
import './style/Auth.css'
import { v4 as uuidv4 } from 'uuid';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationToken = uuidv4();
    try {
        const response = await axios.post('http://localhost:5000/api/register', { ...formData, verificationToken });
        if (response.status === 201) {
          setSuccessMessage('Registration successful. Please check your email for verification instructions.');
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      } catch (error) {
        setErrorMessage('Registration failed. Please try again.');
        console.error('Registration error:', error.response.data.message);
      }
    };
  return (
    <div className='body'>
    <div className='box'>
      <h1>SIGN UP</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>

      
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>
                    Already have an account? <a href="/login">Sign In</a>
                </p>
    </div>
    </div>
  );
}

export default Register;
