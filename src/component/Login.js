import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import './style/Auth.css';

function Login(props) {
  const history = useHistory();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);

      if (response.status === 200) {
        // Check the user's role from the API response
        const { role } = response.data;
        console.log('API Response Data:', response.data); 
        // Store the token in local storage or state as needed
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role',response.data.role);
        localStorage.setItem('username',response.data.username);
       
        const previousPath = props.location.state?.from;
        console.log('Previous Path:', previousPath);


        if (role === 'admin') {
          history.push('/admin/addproduct'); // Redirect to the admin dashboard
        } else if (role === 'user') {

          if (previousPath) {
            // Redirect to the previous path if it exists in local storage
            history.push(previousPath);
          } else {
            // Redirect to the default path (e.g., home) if there is no previous path
            history.push('/');
          }
        }
      } else {
        console.log('Login response:', response.data);
      }
    } catch (error) {
      // Handle login error
      setErrorMessage(error.response.data.message);
      console.error('Login error:', error);
    }
  };

  return (
    <div className='body'>
      <div className='box'>
        <h1>SIGN IN</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit">Login</button>
          <Link to="/forgotpassword">Forgot Password</Link>
        </form>
        <p>
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
