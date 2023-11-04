
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const path = require('path');

// Other server configurations...

// app.use(express.static(path.join(__dirname, 'email-verification-frontend/build')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'email-verification-frontend/build', 'index.html'));
// });

mongoose.connect('mongodb://localhost/pizza', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import and use the routes defined in the routes.js file
const productRoutes = require('./routes');
app.use('/', productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
