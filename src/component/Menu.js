import React, { useState, useEffect } from 'react';
import './style/Home.css';
// import products from './data';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Menu() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getproducts')
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);


  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);
  
    if (existingProduct) {
      // Product already exists in the cart, update its quantity
      const updatedCart = cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // Product doesn't exist in the cart, add it
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  
    // Update the local storage with the updated cart
    const updatedCart = existingProduct
      ? cart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  useEffect(() => {
    // Retrieve cart data from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);


  const removeFromCart = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        const updatedCart = cart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        const updatedCart = cart.filter(item => item._id !== product._id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };
  // Calculate the total price
const productTotalPrice = calculateTotalPrice();

// Add the total price to local storage
localStorage.setItem('productTotalPrice', JSON.stringify(productTotalPrice));
console.log('product Total Price:', productTotalPrice);


  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };
 
  

  return (
    <div>
      <Navbar cartCount={cart.length} toggleCart={toggleCart} />
      <br />
      <br />
      <div>
        {showCart ? (
          <div className="cart"><br /><br />
            <h2>Shopping Cart</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="cart-image" />
                      {product.name}
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeFromCart(product)} className='btn1'>-</button>
                      {product.quantity}
                      <button onClick={() => addToCart(product)} className='btn1'>+</button>
                    </td>
                    <td>${(product.price * product.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeFromCart(product)} className='btn2'> <FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div id='rs'>
              <p>Total Price: </p>
              <h1>${calculateTotalPrice().toFixed(2)}</h1>
              <button onClick={clearCart} className='btn2'>Clear Cart</button>
             

              <Link className="button" to="/shippinginfo">Place Order</Link>
            </div>

          </div>
        ) : (
          <div className='category'>
                       <br />
            <br />
            <a href="/customize"><button>Customize your pizzza</button></a>
            <div className="menu">
              {products.map(product => (
                <div className="item" key={product._id}>
                    <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="pizza-image" />
                    <span className="price">₹{product.price}</span>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                  <button onClick={() => addToCart(product)}>Add to cart</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
