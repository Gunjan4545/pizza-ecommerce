import React,{useState} from 'react';
import './style/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faPizzaSlice } from '@fortawesome/free-solid-svg-icons';
import {Link,useHistory} from 'react-router-dom';

function Navbar({ cartCount, toggleCart }) {
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

 
    const [iscart, setIscart] = useState(false);
  
    const togglebutton = () => {
      setIscart((prevState) => !prevState);
    };


  return (
    <div className="navbar fixed-navbar"> {/* Add the "fixed-navbar" class */}
      <div className="left">
       {isAuthenticated ? (
       <p className='nav'>{Username}</p>
        ) : (
          <p className='nav'><FontAwesomeIcon icon={faPizzaSlice} /> PizzaHubs</p>
        )}
      </div>
      <div className="right">
        
        <Link to="/">Home</Link>
        <Link to="/customize">Customize Pizza</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/menu"><button onClick={toggleCart} >
        <button onClick={togglebutton}>
        {iscart ? "Menu" : <span>
            <FontAwesomeIcon icon={faCartShopping} style={{ color: "#ffffff" }} />
            {cartCount > 0 && (
              <sup className="cart-count">{cartCount}</sup>
            )}
          </span> }
          </button>
        </button></Link>
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
