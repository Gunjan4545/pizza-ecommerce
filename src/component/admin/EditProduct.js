import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from "axios";
import '../style/Products.css';

function EditProduct({ match }) {
  const [ingredients, setIngredients] = useState([]);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: null,
    cheese: null,
    sauce: null,
    base: null,
    veggies: [],
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Fetch ingredients from the API when the component mounts
    axios.get('http://localhost:5000/api/ingredient/get').then((response) => {
      setIngredients(response.data);
    });

    // Fetch product data based on the route parameter (product ID)
    axios.get(`http://localhost:5000/api/getproduct/${match.params.id}`)
      .then((res) => {
        const productData = res.data;
        setProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image, // You may want to handle image updates separately
          cheese: productData.cheese,
          sauce: productData.sauce,
          base: productData.base,
          veggies: productData.veggies,
        });
      })
      .catch((err) => console.log(err));
  }, [match.params.id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({
      ...product,
      image: file,
    });
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attach selected ingredient data to the product
    product.cheese = selectedCheese;
    product.sauce = selectedSauce;
    product.base = selectedBase;
    product.veggies = selectedVeggies;

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('image', product.image);

    // Add the selected ingredient data to the form data
    formData.append('cheese', product.cheese);
    formData.append('sauce', product.sauce);
    formData.append('base', product.base);
    for (const veggie of product.veggies) {
      formData.append('veggies', veggie);
    }

    axios.put(`http://localhost:5000/api/updateproduct/${match.params.id}`, formData)
      .then((res) => {
        setSuccessMessage('Product updated successfully');
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      <div className='product-form'>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <h1>Edit Product</h1>
          <div className='label'>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </div>
          <div className='label'>
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>
          <div className='label'>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Product Price"
            />
          </div>

          <h4>Ingredients</h4>
          <div>
            <label>Cheese: <span>{product.cheese}</span></label>
            <select onChange={handleCheeseChange} value={selectedCheese} required>
              <option value="">Select Cheese</option>
              {ingredients
                .filter((ingredient) => ingredient.type === 'cheese')
                .map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.name}>
                    {ingredient.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label>Sauce: <span>{product.sauce}</span></label>
            <select onChange={handleSauceChange} value={selectedSauce}>
              <option value="">Select Sauce</option>
              {ingredients
                .filter((ingredient) => ingredient.type === 'sauce')
                .map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.name}>
                    {ingredient.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label>Base: <span>{product.base}</span></label>
            <select onChange={handleBaseChange} value={selectedBase}>
              <option value="">Select Base</option>
              {ingredients
                .filter((ingredient) => ingredient.type === 'base')
                .map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.name}>
                    {ingredient.name}
                  </option>
                ))}
            </select>
          </div>
          <label>Veggies & Meat:<span>{product.veggies.join(', ')}</span></label>
          <div className="veggie-options">
            {ingredients
              .filter((ingredient) => ingredient.type === 'veggies')
              .map((ingredient) => (
                <div className='veggies' key={ingredient.id}>
                  <label>
                    <input
                      type="checkbox"
                      value={ingredient.name}
                      checked={selectedVeggies.includes(ingredient.name)}
                      onChange={handleVeggieChange}
                    />
                    {ingredient.name}
                  </label>
                </div>
              ))}
          </div>
          <div className='label'>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
         
  {product.image && !imagePreview && (
    <div className="image-preview">
       <p>*This is old image select new image</p>
      <img src={`http://localhost:5000/uploads/${product.image}`} alt="Preview" width={100} />
    </div>
  )}
  {imagePreview && (
    <div className="image-preview2">
      <p>Selected Image</p>
      <img src={imagePreview} alt="Preview" width={100} />
    </div>
  )}

          <div className='edit-btn'><button type="submit">Update Product</button></div>

        </form>
        {successMessage && (
          <div className='success-message'>
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default EditProduct;
