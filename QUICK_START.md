# Quick Start Guide

## Installation & Setup

```bash
cd /home/support/Documents/redux/jwt
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Demo Credentials
- **Username:** emilys
- **Password:** emilyspass

## Project Features

### 🔐 Authentication
- Login with credentials from DummyJSON API
- Token-based authentication using Redux
- Protected routes with PrivateRoute component
- Automatic logout functionality

### 👤 User Profile (Home Page)
The home page displays comprehensive user information fetched from the API:
- Profile image, first name, last name
- Username, email, phone
- Age, gender, birth date, blood group
- Complete address information
- Company details (name, department, job title)

### �� Products Page
- Display all products in a table format
- Search products by title, brand, or category
- Add new products
- Edit existing products
- Delete products
- Add products to shopping cart
- Stock management

### 🛒 Shopping Cart
- View all items in cart
- Adjust quantity of items
- Remove items from cart
- Clear entire cart
- Calculate total with tax
- Proceed to checkout

### 🎨 Design Features
- Modern gradient color scheme (Blue-Purple)
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Loading and error states
- Card-based layouts
- Interactive hover effects

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          (Main navigation)
│   ├── navbar.css
│   └── PrivateRoute.jsx    (Protected routes)
├── page/
│   ├── Home.jsx            (User profile)
│   ├── Login.jsx           (Authentication)
│   ├── Register.jsx        (User registration)
│   ├── Products.jsx        (Product management)
│   ├── Cart.jsx            (Shopping cart)
│   ├── home.css
│   ├── auth.css
│   ├── products.css
│   └── cart.css
├── features/
│   ├── authSlice.js        (Auth state)
│   ├── cartSlice.js        (Cart state)
│   └── productsSlice.js    (Products state)
├── app/
│   └── store.js            (Redux store)
├── App.jsx
├── AppRoutes.jsx           (Route management)
├── App.css
├── index.css
└── main.jsx
```

## Navigation Flow

```
Login/Register → Home (Profile) → Products → Cart
                    ↓
                Can access Navbar
                Home, Products, Cart
```

## Navbar Features
- ✅ Hidden on login/register pages
- ✅ Shows user's first name
- ✅ Cart badge with item count
- ✅ Navigation links to all pages
- ✅ Logout button

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | User login |
| `/auth/me` | GET | Fetch user data |
| `/products` | GET | Fetch all products |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes
- The app uses localStorage to persist tokens
- Redux Toolkit is used for state management
- Vite is used as the build tool
- React Router v6 for routing
- All styling is CSS (no external UI libraries)

## Troubleshooting

### Login not working?
- Make sure you're using the correct demo credentials
- Check that the DummyJSON API is accessible
- Clear browser cache and localStorage

### Navbar not showing?
- Ensure you're logged in (token should exist)
- Check that you're not on login/register pages
- Verify Redux state in browser DevTools

### Products not loading?
- Check network tab for API errors
- Ensure API endpoint is accessible
- Clear Redux cache

## Support
For issues or questions, check:
1. Browser console for errors
2. Redux DevTools for state issues
3. Network tab for API problems
