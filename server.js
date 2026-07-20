const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible to routes via app settings
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Front-end', 'views'));

// Serve static frontend files (css, js, images, videos, cdn assets)
app.use(express.static(path.join(__dirname, 'Front-end')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Page routes — render EJS views
app.get('/', (req, res) => res.render('index'));
app.get('/store', (req, res) => res.render('store'));
app.get('/product', (req, res) => res.render('product'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/login', (req, res) => res.render('login'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/faqs', (req, res) => res.render('FAQS'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/silder', (req, res) => res.render('silder'));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n Gaming Hub Server running on http://localhost:${PORT}`);
  });
});