const Product = require('./model/Product');
const User = require('./model/User');
const Order = require('./model/Order');
const Ingredient = require('./model/Ingredient')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config'); // Assuming the configuration file is in the same directory
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const razorpayKey = process.env.RAZORPAY_KEY;
const razorpaySecret = process.env.RAZORPAY_SECRET;
const Email = process.env.EMAIL;
const Password = process.env.PASSWORD;
const jwtToken = process.env.JWTSECRET;

const addProduct = async (req, res) => {

  const { name, description, price, cheese, sauce, base, veggies, } = req.body;
  const image = req.file.filename;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      // category,
      image,
      cheese,
      sauce,
      base,
      veggies,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// controllers/productController.js


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const getProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Find the product by ID in your database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is found, send it as a JSON response
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProducts = async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product with the new data
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.cheese = req.body.cheese;
    product.sauce = req.body.sauce;
    product.base = req.body.base;
    product.veggies = req.body.veggies;
    product.image =  req.file.filename;
  

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    console.error('Product update failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail'
  auth: {
    user: Email, // Your email address
    pass: Password, // Your email password or an app-specific password
  },
});

function sendVerificationEmail(email, verificationToken) {
  const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;


  const mailOptions = {
    from: Email,
    to: email,
    subject: 'Email Verification',
    text: `Click the link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Verification email not sent:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
}


const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const saltRounds = 10; // Define the number of salt rounds
  // Generate a random token

    const verificationToken = crypto.randomBytes(20).toString('hex'); // Generate a random token
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken, // Save the token in the user record
    });

    await newUser.save();

    // Send a verification email to the user
    sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Registration successful. Please check your email for verification instructions.' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
  

    user.isVerified = true;
    // user.verificationToken = undefined; // Clear the token
    await user.save();

    res.status(200).json({ message: 'Email verified. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Email verification failed' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'User is not verified. Please check your email for verification instructions.' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and sign a JSON Web Token (JWT)
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      jwtToken
    );

    res.json({ message: 'Login successful', token, role: user.role, username: user.username });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set an expiration time for the token (e.g., 1 hour)
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save the reset token and reset token expiry in the user's record
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send a reset email to the user
    const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;
    const mailOptions = {
      from: Email,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Reset email not sent:', error);
      } else {
        console.log('Reset email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Password reset request failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}
const ResetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log('resetToken:', token);

  try {
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check if the reset token has expired
    if (Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash and save the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: razorpayKey,
  key_secret: razorpaySecret,
});


const createOrder = async (req, res) => {
  try {
    // Extract order data from the request body
    const { user, products, shippingInfo, total, productTotalPrice, customizeTotalPrice, customizeIngradients } = req.body;

    // Create a new order document
    const newOrder = new Order({
      user,
      products,
      shippingInfo,
      productTotalPrice,
      customizeTotalPrice,
      customizeIngradients,
      total,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the saved order data
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 


const getOrders = async (req, res) => {
  // Retrieve the user's ID from the JWT token (you need to implement this part)
  
  const userId = req.user; 
  console.log(userId);// You'll need to set up authentication middleware for this
console.log(userId)
      try {
    const orders = await Order.find({ user: userId })
    .populate('products.product', ['name', 'price', 'description', 'image']).sort({ orderDate: -1 });
   

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
const getAdminOrders = async (req, res) => {
  // Retrieve the user's ID from the JWT token (you need to implement this part)
 // You'll need to set up authentication middleware for this 
  try {
    // Find orders for the specific user
    const orders = await Order.find().populate('products.product',['name', 'price', 'description','image']).sort({ orderDate: -1 });; // Populate the product details

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body.status;

    // Perform the update in your MongoDB database
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = req.params.id;

    // Use Mongoose to find and remove the product by ID
    const deletedProduct = await Product.findByIdAndRemove(product);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const razorpayorder = async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: razorpayKey,
			key_secret: razorpaySecret,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};

const razorpayverify = async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", razorpaySecret)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};

const createIngradient = async (req, res) => {
  try {
    const { name, quantity, type, price } = req.body;
    const newIngredient = new Ingredient({ name, quantity, type, price });
    const savedIngredient = await newIngredient.save();
    res.status(201).json(savedIngredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: 'Error creating ingredient' });
  }
};
const getIngradient = async (req, res) => {
   try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

};
const updateIngradient = async (req, res) => {
  try {
    const ingredientId = req.params.id;
    const updatedQuantity = req.body.quantity;
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      ingredientId,
      { quantity: updatedQuantity },
      { new: true }
    );
    res.json(updatedIngredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Error updating ingredient' });
  }
};
const deleteIngradient = async (req, res) => {
  try {
    const ingredientId = req.params.id;
    await Ingredient.findByIdAndRemove(ingredientId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: 'Error deleting ingredient' });
  }
};

async function sendEmailToAdmin(ingredientName, quantity) {

  // Email message configuration
  const mailOptions = {
    from: Email,
    to: Email, // Admin's email address
    subject: 'Low Ingredient Quantity Alert',
    text: `Ingredient "${ingredientName}" has fallen below 20. Current quantity: ${quantity}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

const reduceIngredient = async (req, res) =>  {

  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId).populate('products.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const ingredientsToReduce = [];

    if (order.customizeIngradients) {
      for (const key in order.customizeIngradients) {
        if (order.customizeIngradients.hasOwnProperty(key) && key !== 'quantity') {
          ingredientsToReduce.push({ name: order.customizeIngradients[key], quantity: order.customizeIngradients.quantity });
        }
      }
    }

    if (order.products && order.products.length > 0) {
      for (const productData of order.products) {
        const { product, quantity } = productData;
        const { cheese, base, sauce, veggies } = product;

        ingredientsToReduce.push(
          { name: cheese, quantity },
          { name: base, quantity },
          { name: sauce, quantity },
          ...veggies.map(veggie => ({ name: veggie, quantity }))
        );
      }
    }

    for (const ingredient of ingredientsToReduce) {
      const { name, quantity } = ingredient;
      const existingIngredient = await Ingredient.findOne({ name });

      if (existingIngredient) {
        const updatedQuantity = existingIngredient.quantity - quantity;
        await Ingredient.findOneAndUpdate({ name }, { quantity: updatedQuantity });

      } else {
        console.log(`Ingredient "${name}" not found in the Ingredient model`);
      }

    }
    const lowQuantityIngredients = await Ingredient.find({ quantity: { $lt: 20 } });

    for (const ingredient of lowQuantityIngredients) {
      sendEmailToAdmin(ingredient.name, ingredient.quantity);
    }
    return res.json({ message: 'Ingredients reduced successfully' });

  

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while reducing ingredients' });
  }
}






module.exports = {
  addProduct,
  getProducts,
  getAllProducts,
  registerUser,
  loginUser,
  createOrder,
  getOrders,
  getAdminOrders,
  updateOrderStatus,
  deleteProduct,
  verifyEmail,
  ForgotPassword,
  ResetPassword,
  razorpayorder,
  razorpayverify,
  createIngradient,
  getIngradient,
  deleteIngradient,
  updateIngradient,
  reduceIngredient,
  updateProducts
};
