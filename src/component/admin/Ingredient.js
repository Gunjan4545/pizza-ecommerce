import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Ingredient() {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch ingredients from the server when the component mounts
    axios.get('http://localhost:5000/api/ingredient/get').then((response) => {
      setIngredients(response.data);
    });
  }, []);

  const handleUpdateQuantity = async (ingredientId) => {
    try {
      const updatedQuantity = prompt('Enter the new quantity:');
      if (updatedQuantity !== null) {
        await axios.put(`http://localhost:5000/api/ingredient/put/${ingredientId}`, { quantity: updatedQuantity });
        // Refresh the list of ingredients
        const response = await axios.get('http://localhost:5000/api/ingredient/get');
        setIngredients(response.data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    try {
      if (window.confirm('Are you sure you want to delete this ingredient?')) {
        await axios.delete(`http://localhost:5000/api/ingredient/delete/${ingredientId}`);
        // Refresh the list of ingredients
        const response = await axios.get('http://localhost:5000/api/ingredient/get');
        setIngredients(response.data);
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  const handleCreateIngredient = async () => {
    try {
      const newIngredient = {
        name,
        quantity,
        price,
        type
      };

      // Send a POST request to create a new ingredient
      await axios.post('http://localhost:5000/api/ingredient/post', newIngredient);
      // Refresh the list of ingredients
      const response = await axios.get('http://localhost:5000/api/ingredient/get');
      setIngredients(response.data);

      // Clear the input fields
      setName('');
      setQuantity(0);
      setType('');
      setPrice('0');
    } catch (error) {
      console.error('Error creating ingredient:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <br /><br /><br />
    <div className='ingredients'>
      <h2>Manage Ingredients</h2>
      <div className='Iform'>
        <h3>Create a New Ingredient</h3>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Type:</label>
          <select
                  value={type}
                  onChange={(e) =>setType(e.target.value)} >
                  <option value="cheese">Cheese</option>
                  <option value="base">Base</option>
                  <option value="sauce">Sauce</option>
                  <option value="veggies">Veggies & Meat</option>
                </select>
        </div>
       
        <button onClick={handleCreateIngredient}>Create Ingredient</button>
      </div>
      <div>
        <h3>Ingredients List</h3>
        <div className="ingredient-cards">
          {ingredients.map((ingredient) => (
            <div key={ingredient._id} className="ingredient-card">
              <h4>{ingredient.name}</h4>
              <p>Quantity: <button onClick={() => handleUpdateQuantity(ingredient._id)}>{ingredient.quantity}</button></p>
              <p>Price: {ingredient.price}</p>
              <div>
                <button className='trash-button' onClick={() => handleDeleteIngredient(ingredient._id)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default Ingredient;
