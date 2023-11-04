// App.js
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; // Use Route and Switch
import Home from './component/Home';
import Menu from './component/Menu';
import ProductForm from './component/admin/Productform';
import Orders from './component/Orders';
import Adminorders from './component/admin/Adminorders';
import Productlist from './component/admin/Productlist';
import Login from './component/Login';
import Register from './component/Register';
import Checkout from './component/Checkout.js';
import EmailVerification from './component/EmailVerification';
import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';
import Customize from './component/Customize';
import ShippingInfo from './component/ShippingInfo';
import Ingredient from './component/admin/Ingredient';
import EditProduct from './component/admin/EditProduct.js';
function App() {

  // Define a function to check if the user is authenticated
function isAdmin() {

  const authToken = localStorage.getItem('token');
  const authRole = localStorage.getItem('role')
   // Get the authentication token from local storage
  console.log('authToken:', authToken);
  console.log('authRole:', authRole);
 
  if (authToken && authRole==='admin') {

      return true;
  }
  

  return false; // Return false if not authenticated
}

function isUser() {

  const authToken = localStorage.getItem('token');
  const authRole = localStorage.getItem('role')
   // Get the authentication token from local storage
  console.log('authToken:', authToken);
  console.log('authRole:', authRole);
 
  if (authToken && authRole==='user') {

      return true;
  }
  

  return false; // Return false if not authenticated
}

function AdminRoute({ component: Component, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) =>
              isAdmin() ? (
                  <Component {...props} />
              ) : (
                <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
              )
          }
      />
  );
}

function UserRoute({ component: Component, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) =>
              isUser() ? (
                  <Component {...props} />
              ) : (
                <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
              )
          }
      />
  );
}
  return (
    <BrowserRouter>
      <div>
        <Switch> {/* Use Switch instead of Routes */}
        <Route exact path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/verify" component={EmailVerification} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetpassword" component={ResetPassword} />
          <Route path="/customize" component={Customize} />
          <UserRoute path="/orders" component={Orders} />
          <UserRoute path="/shippinginfo" component={ShippingInfo} />
          <UserRoute path="/checkout" component={Checkout} />
          <AdminRoute path="/ingredient" component={Ingredient} />
          <AdminRoute path="/admin/addproduct" component={ProductForm} />
          <AdminRoute path="/admin/adminorders" component={Adminorders} />
          <AdminRoute path="/admin/productlist" component={Productlist} />
          <Route path="/products/edit/:id" component={EditProduct} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
