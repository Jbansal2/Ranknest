const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");


const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Routes
const router = require("./routers/auth");
app.use("/api/auth", router);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Ranknest API",
    version: "1.0.0",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});

const dbConnect = require("./config/database");
const initializeDatabase = async () => {
  try {
    await dbConnect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); 
  }
};
initializeDatabase();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.length} configured`);
});

