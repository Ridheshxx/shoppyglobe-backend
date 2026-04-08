<<<<<<< HEAD
🛒 ShoppyGlobe Backend API

🚀 Project Overview

ShoppyGlobe Backend is a RESTful API built using Node.js, Express.js, and MongoDB for an E-commerce application.
It supports product management, user authentication, and cart operations with secure JWT-based authorization


🧰 Tech Stack
	•	Node.js
	•	Express.js
	•	MongoDB (Mongoose)
	•	JWT Authentication
	•	bcryptjs (Password Hashing)


📁 Project Structure

shoppyglobe-backend/
│
├── src/
│   ├── config/        # DB connection
│   ├── controllers/   # Business logic
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth & error handling
│   ├── utils/         # Helper functions
│   └── validators/    # Input validation
│
├── screenshots/       # API + DB screenshots
├── docs/              # Documentation
├── .env
├── .gitignore
├── server.js
└── README.md


⚙️ Installation & Setup

1️⃣ Clone Repository
git clone <your-github-link>
cd shoppyglobe-backend

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables (.env)

PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/shoppyglobe

JWT_SECRET=supersecretkey123
JWT_EXPIRE=7d

4️⃣ Start Server
npm run dev

🌐 API Base URL
http://localhost:3000

🔐 Authentication APIs

🆕 Register User
POST /api/auth/register

🔓 Login User
POST /api/auth/login

📦 Product APIs

🔍 Get All Products
GET /api/products

🔍 Get Product by ID
GET /api/products/:id

➕ Create Product (Protected)
POST /api/products

🔄 Update Product (Protected)
PUT /api/products/:id

❌ Delete Product (Protected)
DELETE /api/products/:id

🛒 Cart APIs (Protected)

📥 Get Cart
GET /api/cart

➕ Add to Cart
POST /api/cart

🔄 Update Cart Item
PUT /api/cart/:productId

❌ Remove Item
DELETE /api/cart/:productId

🧹 Clear Cart

DELETE /api/cart
🔒 Authorization

All protected routes require JWT token:
Authorization: Bearer <your_token>


❗ Error Handling
	•	Global error middleware implemented
	•	Handles invalid IDs, duplicate entries, and server errors
	•	Clean JSON response format


🗄️ MongoDB Collections
	•	Users
	•	Products
	•	Cart


🧪 API Testing

All APIs tested using ThunderClient/Postman


📸 Screenshots (Important for Submission)

Include screenshots for:
	•	API testing (all routes)
	•	MongoDB collections


📦 Submission Details
	•	GitHub repository with full code
	•	README file (this document)
	•	Screenshots included in /screenshots folder

👨‍💻 Author

Ridhesh Chavarekar


🎯 Conclusion

This project demonstrates a complete backend system with authentication, database integration, and RESTful API design following industry best practices.
=======
# shoppyglobe-backend
ShoppyGlobe Backend API using Node.js, Express, MongoDB with JWT Authentication and Cart System
>>>>>>> 3f145c7f1439a80f64a2ead9a3c0bc86384c5333
