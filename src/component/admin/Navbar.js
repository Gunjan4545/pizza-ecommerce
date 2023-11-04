import React from 'react';
import '../style/Navbar.css'
import {Link,useHistory} from 'react-router-dom';
function Navbar() {
  const isAuthenticated = localStorage.getItem('token');
  const Username = localStorage.getItem('username');
  const History = useHistory();
    const handleLogout = () => {
      // Perform logout actions (clear session or token)
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      History.push('/')
      
    };
  return (
    <div className="navbar fixed-navbar"> 
    <div className="left">
      
       <p className='nav'>{Username}</p>
       
      </div>
    <div className="right">
       <Link to="/admin/addproduct">Add Products</Link>
       <Link to="/admin/Adminorders">Orders</Link>
       <Link to="/admin/productlist">Products</Link>
       <Link to="/ingredient">Ingredient stock</Link>
       <Link to="/about"> </Link>
      
       <div className="navbar-buttons">
        {isAuthenticated ? (
          // If the user is authenticated, show the Logout button
          <button onClick={handleLogout}>Logout</button>
        ) : (
          // If the user is not authenticated, show the Login button
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
      </div>
      </div>
  );
}

export default Navbar;
