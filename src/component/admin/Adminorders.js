import React, { useState, useEffect } from 'react';
import '../style/Home.css';
import Navbar from '../admin/Navbar';
import axios from 'axios';

function Adminorders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {


    // Make an API request to fetch the user's orders
    axios.get('http://localhost:5000/api/adminorders', {
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
  }, [token]);

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



  const updateOrderStatus = (orderId, newStatus) => {


    // Make an API request to update the order status
    axios
      .put(`http://localhost:5000/api/adminorders/${orderId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Handle the success case (e.g., update UI or show a success message)
        console.log('Order status updated successfully');

        // Update the state to reflect the changed status
        setOrders(prevOrders => prevOrders.map(order => {
          if (order._id === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        }));
      })
      .catch(error => {
        // Handle errors, e.g., unauthorized access or network issues
        console.error('Error updating order status', error);
      });
  };

  const handleReduceIngredients = (orderId) => {

    // Make an API request to reduce ingredients
    axios
      .post('http://localhost:5000/api/ingredient/reduce', { orderId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Handle the success case (e.g., update UI or show a success message)
        console.log('Ingredients reduced successfully');
        setOrders(prevOrders =>
          prevOrders.map(order => {
            if (order._id === orderId) {
              return { ...order, ingredientsReduced: true };
            }
            return order;
          })
        );


      })
      .catch(error => {
        // Handle errors, e.g., unauthorized access or network issues
        console.error('Error reducing ingredients', error);
      });
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
              <td>

                <select
                  name="status"
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    updateOrderStatus(order._id, newStatus);
                  }} disabled={order.status === "Delivered"} >
                  <option value="Order received">Order Received</option>
                  <option value="In the kitchen">In the kitchen</option>
                  <option value="Sent to delivery">Sent to Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
              <td>₹ {order.total}</td>
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
                            Product price: ₹ {product.product.price}
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
              <td>
                {/* Button to reduce ingredients */}
                {!order.ingredientsReduced && (
                  <button
                    onClick={() => handleReduceIngredients(order._id)}
                  >
                    Reduce Ingredients
                  </button>
                )}
                  <div>
                      {order.ingredientsReduced && (
                        <div className="success-message">
                          Ingredients reduced successfully!
                        </div>
                      )}
                    </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Adminorders;
