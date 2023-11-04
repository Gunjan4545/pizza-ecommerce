import React, { useState, useEffect } from 'react';
import './style/Home.css';
import Navbar from './Navbar';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState({});

  useEffect(() => {
    // Retrieve the user's JWT token (you need to implement this part)
    const token = localStorage.getItem('token'); // Get the JWT token from local storage

    // Make an API request to fetch the user's orders
    axios.get('http://localhost:5000/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        // Handle errors, e.g., unauthorized access or network issues
      });
  }, []);

  const showProductDetails = (order) => {
    // Toggle the selected order if it's the same order, close it if it's already open
    if (selectedOrder && selectedOrder._id === order._id) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(order);
    }

    setIsDetailsOpen((prevState) => ({
      ...prevState,
      [order._id]: !prevState[order._id],
    }));
  };
  return (
    <div>
      <Navbar />
      <br />
      <br />
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Shipping Details</th>
            <th>Status</th>
            <th>Total Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                Name: {order.shippingInfo.name}<br />
                Address: {order.shippingInfo.address}<br />
                Contact: {order.shippingInfo.contact}
              </td>
              <td>{order.status}</td>
              <td>₹{order.total}</td>
              <td>
                <div className='btn'>
                  <button onClick={() => showProductDetails(order)}>
                    {isDetailsOpen[order._id] ? 'Hide' : 'Show More'}
                  </button>
                </div>
                {isDetailsOpen[order._id] && (
                  <div>
                    {/* Render product details here */}

                    {order.products.map(product => (

                      <table>
                        <tr key={product.product._id}>
                          <td><img
                            src={`http://localhost:5000/uploads/${product.product.image}`}
                            alt={product.product.name}
                            height="70"
                            width="100"

                          /></td>
                          <td>  Product Name: {product.product.name}
                            <br />
                            Product price:₹ {product.product.price}
                            <br />
                            Product description: {product.product.description}
                            <br />
                            Quantity: {product.quantity}
                            <br /></td>
                        </tr>
                      </table>

                    ))}
                     {order.productTotalPrice && (
                        <p>Total Price:₹ {order.productTotalPrice}</p>
                      )}
   <div>
                      {order.customizeIngradients.base && (
                        <>
                          <h3>Customized Pizza</h3>
                          <p>Base: {order.customizeIngradients.base}</p>
                        </>
                      )}
                      {order.customizeIngradients.cheese && (
                        <p>Cheese: {order.customizeIngradients.cheese}</p>
                      )}
                      {order.customizeIngradients.base && (
                        <p>Base: {order.customizeIngradients.base}</p>
                      )}
                      {order.customizeIngradients.sauce && (
                        <p>Sauce: {order.customizeIngradients.sauce}</p>
                      )}
                      {order.customizeIngradients.veggies && order.customizeIngradients.veggies.length > 0 && (
                        <p>Veggies & Meat: {order.customizeIngradients.veggies.join(', ')}</p>
                      )}
                       {order.customizeIngradients.quantity && (
                        <p>Qantity: {order.customizeIngradients.quantity}</p>
                      )}
                        {order.customizeTotalPrice && (
                        <p>Total Price:₹ {order.customizeTotalPrice}</p>
                      )}
                    </div>
                  </div>
                  
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
