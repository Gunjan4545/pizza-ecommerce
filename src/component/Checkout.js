import React from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import './style/Home.css';
import Navbar from "./Navbar";


function Checkout() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails'));
	const productTotalPrice = JSON.parse(localStorage.getItem("productTotalPrice"));
	const customizeTotalPrice = JSON.parse(localStorage.getItem("customizeTotalPrice"));
	const ingredients = JSON.parse(localStorage.getItem('Ingredients')) || [];
	const customizeIngradientsData = {
		cheese: ingredients.cheese,
		sauce: ingredients.sauce,
		base: ingredients.base,
		veggies: ingredients.veggies,
		quantity:ingredients.quantity
	};
	const totalPrice = productTotalPrice + customizeTotalPrice;
	localStorage.setItem('totalPrice', JSON.stringify(totalPrice));

	const history = useHistory();
	function decodeJwtToken(tokenn) {
		try {
			const base64Url = tokenn.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const payload = JSON.parse(atob(base64));
			return payload;
		} catch (error) {
			console.error('Error decoding JWT token:', error);
			return null;
		}
	}


	const initPayment = (data) => {
		const options = {
			key: "rzp_test_jc6o7pwcsqLktl",
			amount: data.totalPrice,
			currency: data.currency,
			description: "Test Transaction",
			order_id: data.id,
			handler: async (response) => {
				try {
					const verifyUrl = "http://localhost:5000/api/payment/verify";
					const { data } = await axios.post(verifyUrl, response);
					console.log(data);

					// If payment is successful and verified, save the order
					if (data.message === 'Payment verified successfully') {
						const jwtToken = localStorage.getItem('token');
						if (jwtToken) {
							const decodedToken = decodeJwtToken(jwtToken);
							if (decodedToken) {
								const userId = decodedToken._id;


								const orderData = {
									user: userId,
									products: cart.map(product => ({
										product: product._id,
										quantity: product.quantity,
									})),
									productTotalPrice: productTotalPrice,
									customizeTotalPrice: customizeTotalPrice,
									customizeIngradients: customizeIngradientsData,
									shippingInfo: shippingDetails,
									total: totalPrice,
								};

								axios.post('http://localhost:5000/api/createorder', orderData)
									.then((res) => {
										if (res.status === 201) {
											console.log('Order created:', res.data);
											localStorage.removeItem('cart');
											localStorage.removeItem('shippingDetails');
											localStorage.removeItem('productTotalPrice');
											localStorage.removeItem('totalPrice');
											localStorage.removeItem('customizeTotalPrice');
											localStorage.removeItem('Ingredients');
											window.alert('Order placed successfully!');
											history.push('/orders');
										} else {
											window.alert('Order placement failed. Please try again.');
										}
									})
									.catch((err) => {
										console.error('Error creating order:', err);
									});
							} else {
								console.error('Invalid JWT token');
							}
						} else {
							console.error('JWT token not found in local storage');
						}
					}

				} catch (error) {
					console.log(error);
				}
			},
			theme: {
				color: "#260564",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};



	const handlePayment = async () => {
		try {
			const orderUrl = "http://localhost:5000/api/payment/orders";
			const { data } = await axios.post(orderUrl, { amount: totalPrice });
			console.log(data);
			initPayment(data.data);
			console.log(ingredients.cheese)

		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Navbar />
			<br />
			<div className="checkout-container">
				<div className="total-price">
					<h2>Billing</h2>
				</div>

				<ul>
					<div className="cart-details">
						<li><h3>Shipping Details:</h3></li>
						<p>Name: {shippingDetails.name}</p>
						<p>Contact No. {shippingDetails.contact}</p>
						<p>Address: {shippingDetails.address}</p>

						{cart.length > 0 ? (
							<React.Fragment>
								<li><h3>Cart:</h3></li>
								
									<table>
									{cart.map((product, index) => (
										<tr key={index}>

											<td>  Product Name: {product.name}
												<br />
												Product price: {product.price}
												<br />
												Product description: {product.description}
												<br />
												Quantity: {product.quantity}
												<br /></td>
											<td><img
												src={`http://localhost:5000/uploads/${product.image}`}
												alt={product.name}
												height="70"
												width="100"

											/></td>
										</tr>
										))}
										<tr>
											Price:{productTotalPrice}
										</tr>
									</table>

								

							</React.Fragment>
						) : (
							""
						)}
				
				{ingredients && (ingredients.base || ingredients.cheese || ingredients.sauce || ingredients.veggies) ? (
	<React.Fragment>
	  <li><h3>Customized Pizza:</h3></li>
	  <p>Base: {ingredients.base}</p>
	  <p>Cheese: {ingredients.cheese}</p>
	  <p>Sauce: {ingredients.sauce}</p>
	  <p>Veggies: {ingredients.veggies && ingredients.veggies.length > 0 ? ingredients.veggies.join(', ') : "Not selected"}</p>
	  <p>Quantity: {ingredients.quantity}</p>
	  <p>Price:{customizeTotalPrice}</p>
	  {/* You can customize the presentation as needed */}
	</React.Fragment>
  ) : (
	""
  )}
					</div>
				</ul>
				<div className="total-price">
					<h2>Total Price: <span>${totalPrice} /-</span></h2>
				</div>


				<button onClick={handlePayment} className="buy-btn">
					Pay Now
				</button>
			</div>
		</>
	)
}

export default Checkout