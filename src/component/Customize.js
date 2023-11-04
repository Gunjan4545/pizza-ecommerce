import React, { useState, useEffect } from 'react';
import './style/Customize.css';
import Navbar from './Navbar';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Customize() {
  const history = useHistory();
  const [ingredients, setIngredients] = useState([]);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    // Fetch ingredients from the API when the component mounts
    axios.get('http://localhost:5000/api/ingredient/get').then((response) => {
      setIngredients(response.data);
    });
  }, []);
  const handleCheeseChange = (e) => {
    setSelectedCheese(e.target.value);
  };

  const handleSauceChange = (e) => {
    setSelectedSauce(e.target.value);
  };

  const handleBaseChange = (e) => {
    setSelectedBase(e.target.value);
  };

  const handleVeggieChange = (e) => {
    const veggieName = e.target.value;
    setSelectedVeggies((prevSelected) => {
      if (prevSelected.includes(veggieName)) {
        return prevSelected.filter((veggie) => veggie !== veggieName);
      } else {
        return [...prevSelected, veggieName];
      }
    });
  };

  const calculateTotalPrice = () => {
    const cheesePrice = selectedCheese ? ingredients.find((i) => i.name === selectedCheese).price : 0;
    const saucePrice = selectedSauce ? ingredients.find((i) => i.name === selectedSauce).price : 0;
    const basePrice = selectedBase ? ingredients.find((i) => i.name === selectedBase).price : 0;
    const veggiesPrice = selectedVeggies.reduce((totalPrice, veggieName) => {
      const veggie = ingredients.find((i) => i.name === veggieName);
      return totalPrice + (veggie ? veggie.price : 0);
    }, 0);

    return (cheesePrice + saucePrice + basePrice + veggiesPrice) * quantity;
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  const handleOrderNow = () => {
    const missingIngredients = [];

    if (!selectedBase) {
      missingIngredients.push("Base");
    }
  
    if (!selectedCheese) {
      missingIngredients.push("Cheese");
    }
  
    if (!selectedSauce) {
      missingIngredients.push("Sauce");
    }
    if (selectedVeggies.length === 0) {
      missingIngredients.push("Veggies & Meat");
    }
    if (missingIngredients.length > 0) {
      const missingIngredientsText = missingIngredients.join(', ');
      alert(`Please select the following ingredients: ${missingIngredientsText}`);
      return; // Exit the function
    }
    // Create an object to store the selected ingredients and total price
    const ingredients = {
      cheese: selectedCheese,
      veggies: selectedVeggies,
      sauce: selectedSauce,
      base: selectedBase,
      quantity: quantity
    };

    // Calculate the total price
    const Total = calculateTotalPrice();

    // Store the data in local storage
    localStorage.setItem('Ingredients', JSON.stringify(ingredients));
    localStorage.setItem('customizeTotalPrice', Total);
    // Redirect to the order page or any other page
    // You can use history.push('/order') if using React Router
    // Or window.location.href = '/order' for a simple redirect
    const Ingredients = JSON.parse(localStorage.getItem("Ingredients"));

    const customizeTotalPrice = JSON.parse(localStorage.getItem("customizeTotalPrice"));
    console.log(Ingredients);
    console.log(customizeTotalPrice);
    history.push("/shippinginfo");
  };




  return (
    <>
      <Navbar />
      <div className='body'>
        <h3>Customize your pizza</h3>
        <div className="pizza-container">
          <div className="left-section">
            <h2>Select Ingredients:</h2>
            <div>
              <label>Cheese:</label>
              <select onChange={handleCheeseChange} >
                <option value="">Select Cheese</option>
                {ingredients
                  .filter((ingredient) => ingredient.type === 'cheese')
                  .map((ingredient) => (
                    <option key={ingredient._id} value={ingredient.name}>
                      {ingredient.name} (+₹{ingredient.price})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Sauce:</label>
              <select onChange={handleSauceChange}>
                <option value="">Select Sauce</option>
                {ingredients
                  .filter((ingredient) => ingredient.type === 'sauce')
                  .map((ingredient) => (
                    <option key={ingredient._id} value={ingredient.name}>
                      {ingredient.name} (+₹{ingredient.price})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Base:</label>
              <select onChange={handleBaseChange}>
                <option value="">Select Base</option>
                {ingredients
                  .filter((ingredient) => ingredient.type === 'base')
                  .map((ingredient) => (
                    <option key={ingredient._id} value={ingredient.name}>
                      {ingredient.name} (+₹{ingredient.price})
                    </option>
                  ))}
              </select>
            </div>
            <label>Veggies & Meat:</label>
            <div class="veggie-options">
              {ingredients
                .filter((ingredient) => ingredient.type === 'veggies')
                .map((ingredient) => (
                  <div className='veggies' key={ingredient._id}>
                    <label>
                      <input
                        type="checkbox"
                        value={ingredient.name}
                        checked={selectedVeggies.includes(ingredient.name)}
                        onChange={handleVeggieChange}
                      />
                      {ingredient.name} (+₹{ingredient.price})
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <div className="right-section">
            <h2>Selected Ingredients:</h2>
            <p>Cheese: <span>{selectedCheese}</span> </p>
            <p>Veggies & Meat: <span>{selectedVeggies.join(', ')}</span> </p>
            <p>Sauce: <span>{selectedSauce}</span></p>
            <p>Base: <span>{selectedBase}</span></p>
            <div className="quantity-control">
              <p>Quantity :{" "}
                <button onClick={decrementQuantity}>-</button>
                <span> {quantity} </span>
                <button onClick={incrementQuantity}>+</button></p>
            </div>
            <h2>Total Price:</h2>
            <h1> ₹{calculateTotalPrice()}</h1>
            <button class="order-button" onClick={handleOrderNow}>Order Now</button>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Customize;
