import React from 'react'
import './style/Home.css';
import Navbar from './Navbar';


function Home() {
 
     return (
        <>
        <Navbar />
        <br />
        <br />
        <div className="pizza-order-home">
             
            <div className="pizza-order">
                <h1>Welcome to Pizza Express!</h1>
                <p>Build your custom pizza and place your order.</p>
                <a href='/menu'>Start Your Order</a>
            </div>
        </div>
        </>
    );
}

export default Home