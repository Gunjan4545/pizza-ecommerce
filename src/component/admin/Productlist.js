import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../style/Home.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
function Productlist() {
  const [products, setProducts] = useState([]);
 

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getproducts')
        .then((res) => {
          console.log(res.data);
          setProducts(res.data);
        })
        .catch((err)=> console.log(err));
},[]);
const deleteProduct = (productId) => {
  // Send a DELETE request to your API to delete the product by ID
  axios
    .delete(`http://localhost:5000/api/deleteproduct/${productId}`)
    .then((res) => {
      // Handle the success case, e.g., remove the deleted product from the state
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    })
    .catch((err) => console.log(err));
};


  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className='category'>
        
        <div className="menu">
          {products.map(product => (
            <div className="item" key={product._id}>
              <div>
                <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="pizza-image" />
                <span className="price">₹{product.price}</span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                
              </div>
              
              <Link to={`/products/edit/${product._id}`}><button className='btn1'><FontAwesomeIcon icon={faEdit} style={{color: "#0c0c0d",}} /></button></Link>  
              <button className='btn2' onClick={() => deleteProduct(product._id)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productlist;
