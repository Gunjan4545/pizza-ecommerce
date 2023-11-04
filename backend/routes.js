const express = require('express');
const multer = require('multer');
const path = require('path');
const {v4: uuidv4}=require('uuid');
const router = express.Router();
const controllers = require('./controller'); // Import the addProduct function from the controller
const middleware = require('./middleware/Authmiddleware')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // Create an 'uploads' directory to store uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}_${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Define the "add product" route
router.post('/api/saveproducts', upload.single('image'),controllers.addProduct);
router.get('/api/getproducts', controllers.getAllProducts);
router.get('/api/getproduct/:id', controllers.getProducts);
router.post('/api/register', controllers.registerUser);
router.post('/api/login', controllers.loginUser);
router.get('/api/verify', controllers.verifyEmail);
router.post('/api/forgotpassword', controllers.ForgotPassword);
router.post('/api/resetpassword', controllers.ResetPassword);
router.post('/api/createorder', controllers.createOrder);
router.get('/api/orders',middleware.verifyToken('user'), controllers.getOrders);
router.get('/api/adminorders',middleware.verifyToken('admin'), controllers.getAdminOrders);
router.put('/api/adminorders/:id',middleware.verifyToken('admin'), controllers.updateOrderStatus);
router.delete('/api/deleteproduct/:id', controllers.deleteProduct);
router.post('/api/payment/orders', controllers.razorpayorder);
router.post('/api/payment/verify', controllers.razorpayverify);
router.post('/api/ingredient/post', controllers.createIngradient);
router.get('/api/ingredient/get', controllers.getIngradient);
router.put('/api/ingredient/put/:id', controllers.updateIngradient);
router.delete('/api/ingredient/delete/:id', controllers.deleteIngradient);
router.post('/api/ingredient/reduce',middleware.verifyToken('admin'), controllers.reduceIngredient);
router.put('/api/updateproduct/:id', upload.single('image'), controllers.updateProducts);

module.exports = router;
