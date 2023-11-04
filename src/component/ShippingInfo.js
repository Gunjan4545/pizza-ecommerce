import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './style/Products.css'; 
import Navbar from './Navbar';

function ShippingInfo() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    address: '',
    contact: '',
  });
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        contact: '',
      });
    
      const handleShippingInfoChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({
          ...shippingDetails,
          [name]: value,
        });
      };
    

      useEffect(() => {
        const storedShippingDetails = localStorage.getItem("shippingDetails");
      
        if (storedShippingDetails) {
          // If shipping details are found in local storage, parse the JSON data and set the state
          const parsedDetails = JSON.parse(storedShippingDetails);
          setShippingDetails(parsedDetails);
        }
      }, []);
      useEffect(() => {
        // Validate the form, ensuring all fields are filled
        const isValid = Object.values(shippingDetails).every((value) => value.trim() !== '');
        setIsFormValid(isValid);
      }, [shippingDetails]);
    
      const handleshippingdetails = () => {
        if (isFormValid) {
          localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
        } else {
          // Handle validation errors and set error messages for unfilled fields
          const validationErrors = {};
          for (const [field, value] of Object.entries(shippingDetails)) {
            if (value.trim() === '') {
              validationErrors[field] = `${field} is required`;
            }
          }
          setErrors(validationErrors);
        }
      };     

  return (
    <>
    <Navbar/>
    <br /><br />
    <br /><br />
    <div className='product-form'>
         <h2>Shipping Details</h2>
         <form>
          <div className="form-group">
            <label htmlFor="name" className="label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingDetails.name}
              onChange={handleShippingInfoChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="label">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingDetails.address}
              onChange={handleShippingInfoChange}
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contact" className="label">
              Contact No:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={shippingDetails.contact}
              onChange={handleShippingInfoChange}
            />
            {errors.contact && <div className="error-message">{errors.contact}</div>}
          </div>
<div className='ship-button'>
          {isFormValid ? (
            <Link to="/checkout" onClick={handleshippingdetails}>
              <button>Checkout</button>
            </Link>
          ) : (
            <button type="button" onClick={handleshippingdetails}>
              Checkout
            </button>
          )}
          </div>
        </form>

    </div>
    </>
  )
}

export default ShippingInfo