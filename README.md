# Demo Shop - React + Redux JWT E-Commerce App

A modern, feature-rich e-commerce application built with React, Redux Toolkit, React Router, and Vite. Includes JWT authentication, product management, shopping cart, and Razorpay payment integration.

## 🚀 Features

- **JWT Authentication** - Login and register with secure token-based authentication
- **Product Catalog** - Browse, search, and manage products
- **Shopping Cart** - Add/remove items, adjust quantities, real-time total calculation
- **Product Management** - Add, edit, delete products with image support
- **Image Upload** - Upload product images from local files or paste image URLs
- **Razorpay Integration** - Dummy payments with test credit card and UPI support
- **User Profile** - View logged-in user details from API
- **Stock Management** - Real-time product stock tracking
- **Order History & Tracking** - View completed orders and track delivery status
- **Apple-Inspired UI** - Modern, glassy design with smooth animations
- **Dark Mode Toggle** - Switch between light and dark themes with persistent storage
- **Responsive Design** - Fully mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **API**: Dummy JSON API (dummyjson.com)
- **Payment Gateway**: Razorpay (Test Mode)
- **Styling**: CSS3 with gradients and animations
- **Development**: ESLint, Babel React Compiler

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn

## 🔧 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd redux/jwt

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 🔐 Authentication

### Demo Credentials
- **Username**: `emilys`
- **Password**: `emilyspass`

Login credentials are fetched from the Dummy JSON API and verified server-side.

## 💳 Payment (Razorpay)

### Test API Key
`rzp_test_SlbdYuyzUmiZSn`

### Test Payment Details
Use these credentials to test payments:

**Credit Card (Visa)**
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/27`
- CVV: `123`

**UPI**
- UPI ID: `success@razorpay`

**Payment Status**: All test payments will show as successful.

## 📁 Project Structure

```
src/
├── main.jsx                  # React entry point with Redux Provider
├── App.jsx                   # BrowserRouter setup
├── AppRoutes.jsx             # Route definitions with auth guards
├── index.css                 # Global styles
├── app/
│   └── store.js              # Redux store configuration
├── features/
│   ├── authSlice.js          # Auth reducers and thunks (login, fetchUserData)
│   ├── productsSlice.js      # Product CRUD operations
│   └── cartSlice.js          # Cart state management
├── components/
│   ├── Navbar.jsx            # Navigation with cart badge
│   └── PrivateRoute.jsx      # Protected route wrapper
└── page/
    ├── Login.jsx             # Login page with demo credentials
    ├── Register.jsx          # Registration form (client-side only)
    ├── Home.jsx              # User profile display
    ├── Products.jsx          # Product listing with add/edit/delete modal
    ├── Cart.jsx              # Shopping cart with Razorpay checkout
    ├── OrderHistory.jsx         # Order history and tracking page
    ├── auth.css                 # Login/Register styles
    ├── home.css                 # Profile page styles
    ├── products.css             # Products page styles
    ├── products-cards.css       # Product cards and modals
    ├── orderHistory.css         # Order history page styles
    └── cart.css              # Cart table styles
```

## 🔄 Redux State Shape

```javascript
{
  auth: {
    token: null | string,
    userData: null | object,
    error: null | string,
    loading: boolean
  },
  products: {
    products: [],
    loading: boolean,
    error: null | string,
    successMsg: null | string,
    isFetched: boolean
  },
  cart: {
    items: [],
    totalPrice: number,
    orders: []
  }
}
```

## 📡 API Integration

### Auth Endpoints
- **Login**: `POST https://dummyjson.com/auth/login`
- **Get User**: `GET https://dummyjson.com/auth/me` (Bearer token required)

### Product Endpoints
- **Fetch Products**: `GET https://dummyjson.com/products?limit=100`
- **Add Product**: `POST https://dummyjson.com/products/add`
- **Update Product**: `PUT https://dummyjson.com/products/{id}`
- **Delete Product**: `DELETE https://dummyjson.com/products/{id}`

## 🎨 Design Features

- **Glassy Morphism**: Frosted glass effect on cards and modals
- **Gradient Backgrounds**: Smooth color transitions
- **Apple-Inspired Typography**: System fonts with proper letter spacing
- **Dark Mode Ready**: Color scheme optimized for light backgrounds
- **Smooth Animations**: Slide-in, fade, and scale transitions
- **Accessible Colors**: High contrast ratios for better readability

## 🌙 Dark Mode

- **Toggle Button**: Located in navbar (🌙/☀️)
- **Persistent Storage**: Theme preference saved in localStorage
- **Full Coverage**: Dark mode applied to all pages and components
- **Smooth Transitions**: Instant theme switching without page reload
- **Reduced Eye Strain**: Dark palette optimized for night viewing

## 🚦 Routes

| Route | Description | Auth Required |
|-------|-------------|---|
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/home` | User profile | Yes |
| `/products` | Product catalog with CRUD | Yes |
| `/cart` | Shopping cart and checkout | Yes |
| `/orders` | Order history and tracking | Yes |

## 🔑 Key Features Explained

### Product Image Upload
- Paste image URL directly into the field
- OR upload image file from your computer
- Real-time preview shows before saving
- Images stored as Base64 data URLs

### Stock Management
- Product stock decreases when added to cart
- Stock increases when removed from cart
- Stock syncing between products and cart pages

### Cart Calculation
- Real-time subtotal calculation
- 10% tax applied to subtotal
- Shipping is free
- Final total includes subtotal + tax

### Razorpay Payment Flow
1. Click "Pay with Razorpay" button
2. Razorpay checkout modal opens
3. Enter test payment details
4. Payment successful → Cart clears
5. Order confirmation shown

### Order History & Tracking
- Completed orders are saved and displayed in the Orders page
- Each order includes order number, placed date, payment ID, and totals
- Tracking status is shown with delivery progress steps
- Orders persist in localStorage for session continuity

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with 4-column grids
- **Tablet**: 2-3 column layouts
- **Mobile**: Single column, optimized touch targets

## 🐛 Troubleshooting

**Payment modal shows "No appropriate payment method found"**
- Ensure you're using test API key in code
- Check that browser allows popups
- Disable browser extensions that might block payment gateway

**Products not loading**
- Check internet connection
- Verify dummyjson.com API is accessible
- Check browser console for error messages

**Login fails**
- Use exact credentials: `emilys` / `emilyspass`
- Ensure JWT token is stored in localStorage
- Check if API endpoint is accessible

## 📦 Dependencies

```json
{
  "@reduxjs/toolkit": "^2.11.2",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-redux": "^9.2.0",
  "react-router-dom": "^7.14.0"
}
```

DevDependencies include Vite, ESLint, Babel, and TypeScript types.

## 🚀 Performance

- **Code Splitting**: Vite automatically chunks code
- **React Compiler**: Optimizes component rendering
- **Lazy Loading**: Routes and components load on demand
- **Caching**: LocalStorage for token persistence

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your own use.

## 💡 Future Enhancements

- Admin dashboard for analytics
- Wishlist functionality
- Product reviews and ratings
- Real payment gateway integration
- Multi-language support

---

**Built with ❤️ using React + Redux + Vite**
