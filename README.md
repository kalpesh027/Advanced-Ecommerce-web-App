# Grocery In Hand | E-commerce Platform

A full-stack e-commerce platform built with React.js frontend and Node.js/Express backend, featuring a complete shopping experience with admin panel, customer authentication, product management, and order processing.

## 🏗️ Project Structure

```
apalabazar/
├── api/                    # Backend Node.js/Express API
│   ├── src/
│   │   ├── controller/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── database/       # Database connection
│   ├── app.js             # Express app configuration
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── client/                # Frontend React application
│   ├── src/
│   │   ├── Admin/         # Admin panel components
│   │   ├── customer/      # Customer-facing components
│   │   └── Pages/         # Static pages
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── docker-compose.yml     # Docker configuration
```

## 🚀 Features

### Customer Features
- User registration and authentication
- Product browsing and search
- Shopping cart and wishlist
- Order placement and tracking
- Product reviews and ratings
- Contact us and FAQ pages
- Responsive design with dark mode support

### Admin Features
- Admin dashboard with analytics
- Product management (CRUD operations)
- Order management
- Customer management
- Category management
- Advertisement management
- Coupon management
- Import/Export functionality
- Time and location settings

### Technical Features
- RESTful API architecture
- JWT authentication
- File upload with Multer
- Image handling with Cloudinary
- Payment integration with Razorpay
- Email notifications with Nodemailer
- Data import/export capabilities
- Docker containerization

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Image Storage:** Cloudinary
- **Payment:** Razorpay
- **Email:** Nodemailer
- **Shipping:** Delhivery API

### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Icons:** React Icons (Font Awesome)
- **Routing:** React Router
- **HTTP Client:** Axios (assumed)
- **Build Tool:** Create React App

### DevOps
- **Containerization:** Docker
- **Process Manager:** PM2 (production)
- **Development:** Nodemon

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Docker (optional, for containerized setup)

## 🔧 Installation & Setup

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Advanced-Ecommerce-web-App
   cd grocery-in-hand
   ```

2. **Backend Setup**
   ```bash
   cd api
   npm install
   
   # Create .env file and configure environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   
   # Start the frontend development server
   npm start
   ```

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## ⚙️ Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```env
# Database
MONGO=mongodb://localhost:27017/groceryinhand
# or for cloud MongoDB
MONGO=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_USER=your_email@gmail.com
PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Delhivery API
DELHIVERY_API_KEY=your_delhivery_api_key

# Environment
NODE_ENV=development
```

## 🚀 Available Scripts

### Backend (`api` directory)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend (`client` directory)
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order by ID

### Wishlist
- `GET /wishlist` - Get user wishlist
- `POST /wishlist/:productId` - Add to wishlist
- `DELETE /wishlist/:productId` - Remove from wishlist
- `DELETE /wishlist` - Clear wishlist

### Reviews
- `GET /reviews/:productId` - Get product reviews
- `POST /reviews` - Create review
- `GET /user/reviews` - Get user reviews

## 📱 Frontend Routes

### Customer Routes
- `/` - Home page
- `/products` - Product listing
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/profile` - User profile
- `/orders` - Order history
- `/contact` - Contact us page
- `/faq` - FAQ page
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/product/create` - Create product
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/categories` - Category management
- `/admin/advertisements` - Advertisement management
- `/admin/coupons` - Coupon management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature')
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Developer

**❤️**
- **Email:** [kalpeshhost@gmail.com](mailto:kalpeshhost@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Website

Website coming soon!

---

Built with ❤️
