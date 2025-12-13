# CBC Frontend - E-commerce & Admin Dashboard

A modern, full-featured React-based e-commerce platform with comprehensive admin dashboard for managing products, orders, customers, and users.

## 📋 Project Overview

CBC Frontend is a sophisticated e-commerce application built with React and Vite, featuring:

- **Customer-facing e-commerce platform** with product browsing, cart, wishlist, and checkout
- **Comprehensive admin dashboard** for product and order management
- **User authentication** with role-based access control (Admin/Customer)
- **Image management** with Supabase integration
- **Real-time notifications** and order tracking
- **Responsive design** using Tailwind CSS

## 🎯 Key Features

### Customer Features
- Product browsing and detailed product pages
- Shopping cart management
- Wishlist functionality
- User account and order management
- Checkout with order placement
- Product filtering by ingredients, skin type, and benefits
- Detailed ingredient pages (Oud, Saffron, Argan, Sandalwood)
- Blog/Journal section
- Our Story and Rituals pages

### Admin Features
- **Dashboard** - Overview and analytics
- **Product Management** - Add, edit, delete products with multi-image support
- **Order Management** - View, filter, and bulk update orders
- **Customer Management** - Track customers, view details, manage status
- **Admin Management** - Manage admin users and permissions
- **Review Management** - Monitor and manage product reviews
- **Profile Management** - Admin profile and settings

## 🏗️ Project Structure

```
cbc-frontend/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── modals/             # Modal components
│   │   │   └── ProfilePictureModal.jsx
│   │   ├── layout/             # Layout components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── BenefitsSection.jsx
│   │   ├── CategoryGrid.jsx
│   │   ├── HeroSection.jsx
│   │   ├── footer.jsx
│   │   ├── header.jsx
│   │   ├── imageSlider.jsx
│   │   ├── Layout.jsx
│   │   ├── Modal.jsx
│   │   ├── cartCard.jsx
│   │   ├── productCard.jsx
│   │   └── ConfigProviderWrapper.jsx
│   ├── pages/
│   │   ├── admin/              # Admin pages
│   │   │   ├── AdminOrdersPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── AdminsPage.jsx
│   │   │   ├── addProductForm.jsx
│   │   │   ├── editProductForm.jsx
│   │   │   ├── addAdminForm.jsx
│   │   │   ├── adminProductsPage.jsx
│   │   │   ├── adminReviewPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── DefaultPage.jsx
│   │   ├── home/               # Customer pages
│   │   │   ├── landing.jsx
│   │   │   ├── product.jsx
│   │   │   ├── productOverview.jsx
│   │   │   ├── cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── OurStory.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── RitualsPage.jsx
│   │   │   └── ingredients/    # Ingredient pages
│   │   │       ├── IngredientsIndex.jsx
│   │   │       ├── OudPage.jsx
│   │   │       ├── SaffronPage.jsx
│   │   │       ├── ArganPage.jsx
│   │   │       └── SandalwoodPage.jsx
│   │   ├── home.jsx
│   │   └── adminHomePage.jsx
│   ├── config/                 # Configuration files
│   ├── context/                # React context for state management
│   ├── utils/
│   │   └── mediaUpload.js      # Supabase image upload utility
│   ├── assets/                 # Static assets
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── constants.js
├── public/                     # Public static files
├── .env                        # Environment variables
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── index.html
```

## 🛠️ Tech Stack

### Frontend Framework & Build
- **React** 18.3+ - UI library
- **Vite** - Next-generation build tool
- **React Router** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Ant Design (antd)** - Enterprise UI components
- **Framer Motion** - Animation library
- **Lucide Icons** - Icon library
- **React Hot Toast** - Toast notifications

### State Management & HTTP
- **React Context API** - State management
- **Axios** - HTTP client with interceptors
- **React Query** - Data fetching and caching

### File & Media Management
- **Supabase** - Backend storage for images
- **@supabase/supabase-js** - Supabase JavaScript client

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and credentials
- Backend server running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cbc-frontend.git
   cd cbc-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5001
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📦 Dependencies

### Core Dependencies
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: Latest version
- `axios`: HTTP client
- `antd`: Ant Design UI components
- `framer-motion`: ^10.x
- `lucide-react`: Icon library
- `react-hot-toast`: Toast notifications
- `@supabase/supabase-js`: Supabase client

### Dev Dependencies
- `vite`: Next-gen build tool
- `@vitejs/plugin-react`: React plugin for Vite
- `tailwindcss`: CSS framework
- `postcss`: CSS processing
- `autoprefixer`: CSS vendor prefixing
- `eslint`: Code linting
- `@eslint/js`: ESLint JavaScript configs

## 🔐 Authentication & Authorization

### Features
- Token-based authentication (JWT)
- Role-based access control (Admin/Customer)
- Persistent login with localStorage
- Protected routes and admin dashboard
- User profile management with image upload

### Implementation
- Authentication tokens stored in localStorage
- Axios interceptors for automatic token inclusion
- Custom events for real-time user updates
- Protected admin routes with role verification

### Authentication Flow
1. User logs in with email/password
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token included in all API requests via axios interceptor
5. Token validation on protected routes
6. Logout clears token and user data

## 🖼️ Image Management

### Supabase Integration
The project uses [Supabase Storage](src/utils/mediaUpload.js) for image hosting:

- **Profile Pictures**: User profile images uploaded via [`ProfilePictureModal`](src/components/modals/ProfilePictureModal.jsx)
- **Product Images**: Product photos managed in [`addProductForm`](src/pages/admin/addProductForm.jsx) and [`editProductForm`](src/pages/admin/editProductForm.jsx)
- **Admin Images**: Admin user profile pictures in [`addAdminForm`](src/pages/admin/addAdminForm.jsx)

### Upload Configuration
- **Bucket Name**: `images`
- **Max File Size**: 5MB
- **Supported Formats**: JPG, PNG, GIF
- **Caching**: 3600 seconds

## 📡 API Integration

### Axios Configuration
[`Header.jsx`](src/components/admin/Header.jsx) implements axios interceptors:

```javascript
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor adds token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Key API Endpoints

#### Products
- `GET /api/products/categories` - Fetch product categories
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/status` - Update order status
- `PUT /api/orders/bulk-update` - Bulk update orders

#### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/:customerId` - Get customer details
- `GET /api/customers/stats` - Customer statistics
- `PUT /api/customers/:customerId/status` - Update customer status

#### Users & Authentication
- `GET /api/users/me` - Get current user data
- `PUT /api/users/profile-picture` - Update profile picture
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

#### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

## 🎨 UI Components

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| [`Layout`](src/components/Layout.jsx) | Main wrapper | Page layout with header/footer |
| [`HeaderComponent`](src/components/admin/Header.jsx) | Admin header | Admin dashboard header |
| [`Sidebar`](src/components/admin/Sidebar.jsx) | Admin sidebar | Navigation menu |
| [`ProductCard`](src/components/productCard.jsx) | Product display | Individual product card |
| [`CartCard`](src/components/cartCard.jsx) | Cart items | Shopping cart item display |
| [`ProfilePictureModal`](src/components/modals/ProfilePictureModal.jsx) | Profile management | Image upload modal |
| [`HeroSection`](src/components/HeroSection.jsx) | Landing page | Hero banner |
| [`CategoryGrid`](src/components/CategoryGrid.jsx) | Product browsing | Category display |

### Modals
- [`ProfilePictureModal`](src/components/modals/ProfilePictureModal.jsx) - Profile image update
- [`Modal.jsx`](src/components/Modal.jsx) - Generic modal component

## 📊 Admin Dashboard Features

### Dashboard Page
- Analytics and overview metrics
- Quick actions and shortcuts
- System utilities (View Site, Documentation, Backup)

### Product Management
- **Add Products**: [`addProductForm`](src/pages/admin/addProductForm.jsx)
  - Multi-step form (Basic Info, Images, Features, Benefits)
  - Multi-image upload
  - Category, tags, and attribute selection
  
- **Edit Products**: [`editProductForm`](src/pages/admin/editProductForm.jsx)
  - Update existing product details
  - Modify images and features
  - Change pricing and stock

- **View Products**: [`adminProductsPage`](src/pages/admin/adminProductsPage.jsx)
  - Product list with filters
  - Search functionality
  - Bulk actions

### Order Management
- **Orders Page**: [`AdminOrdersPage`](src/pages/admin/AdminOrdersPage.jsx)
  - View all orders
  - Filter by status, date, customer
  - Search orders
  - Update order status
  - Bulk update capabilities
  - View detailed order information

### Customer Management
- **Customers Page**: [`CustomersPage`](src/pages/admin/CustomersPage.jsx)
  - View all customers
  - Customer statistics
  - Block/unblock customers
  - View customer details

### User Management
- **Admins Page**: [`AdminsPage`](src/pages/admin/AdminsPage.jsx)
  - Manage admin users
  - Add new admins: [`addAdminForm`](src/pages/admin/addAdminForm.jsx)
  - View admin details

### Reviews Management
- **Reviews Page**: [`adminReviewPage`](src/pages/admin/adminReviewPage.jsx)
  - Monitor product reviews
  - Manage ratings and comments

## 👥 Customer Features

### Product Browsing
- Browse all products: [`product.jsx`](src/pages/home/product.jsx)
- Detailed product view: [`productOverview.jsx`](src/pages/home/productOverview.jsx)
- Ingredient pages: Oud, Saffron, Argan, Sandalwood
- Category and filter navigation

### Shopping Features
- **Cart Management**: [`cart.jsx`](src/pages/home/cart.jsx)
  - Add/remove items
  - Update quantities
  - View total price

- **Wishlist**: [`Wishlist.jsx`](src/pages/home/Wishlist.jsx)
  - Save favorite products
  - Move to cart

- **Checkout**: [`Checkout.jsx`](src/pages/home/Checkout.jsx)
  - Enter shipping details
  - Place orders
  - Order confirmation

### Account Management
- **My Orders**: [`MyOrders.jsx`](src/pages/home/MyOrders.jsx)
- **Order Details**: [`OrderDetails.jsx`](src/pages/home/OrderDetails.jsx)
- **Account Settings**: [`AccountPage.jsx`](src/pages/home/AccountPage.jsx)
- **Profile Picture Upload**: [`ProfilePictureModal`](src/components/modals/ProfilePictureModal.jsx)

### Content Pages
- Landing page: [`landing.jsx`](src/pages/home/landing.jsx)
- Our Story: [`OurStory.jsx`](src/pages/home/OurStory.jsx)
- Journal/Blog: [`Journal.jsx`](src/pages/home/Journal.jsx)
- Rituals: [`RitualsPage.jsx`](src/pages/home/RitualsPage.jsx)

## 🎬 Animation & Interaction

### Framer Motion
- Smooth page transitions
- Modal animations
- Component entrance effects
- Dropdown and menu animations

### Toast Notifications
- Success/error messages using `react-hot-toast`
- Order confirmations
- Error handling feedback

## 🔧 Configuration Files

### Build Configuration
- **vite.config.js** - Vite build settings
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS plugins configuration
- **eslint.config.js** - ESLint rules and configurations

### Environment Variables (.env)
```env
VITE_BACKEND_URL=http://localhost:5001
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

## 🚦 Routing Structure

### Customer Routes
```
/
├── /shop
├── /product/:id
├── /cart
├── /checkout
├── /wishlist
├── /my-orders
├── /order/:id
├── /account
├── /settings
├── /our-story
├── /journal
├── /rituals
├── /ingredients
├── /ingredients/oud
├── /ingredients/saffron
├── /ingredients/argan
└── /ingredients/sandalwood
```

### Admin Routes
```
/admin
├── /dashboard
├── /products
├── /products/add
├── /products/edit/:id
├── /orders
├── /customers
├── /admins
├── /admins/add
├── /reviews
└── /profile
```

## 📱 Responsive Design

- Mobile-first approach using Tailwind CSS
- Breakpoints: sm, md, lg, xl, 2xl
- Mobile navigation with hamburger menu
- Touch-friendly interface
- Optimized layouts for all screen sizes

## 🔒 Security Features

- **Token-based authentication** (JWT)
- **Protected routes** with role verification
- **Secure password handling** via backend
- **CORS configuration** for API requests
- **Input validation** on forms
- **File upload validation** (type and size)

## 🐛 Error Handling

- Axios error interceptors
- Toast notifications for user feedback
- Try-catch blocks in async operations
- Console error logging for debugging
- User-friendly error messages

## 📈 Performance Optimization

- Code splitting with React Router
- Image optimization with Supabase CDN
- Lazy loading for components
- Efficient state management with Context API
- Memoization where necessary

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Author

CBC Frontend Development Team

## 📞 Support

For issues and questions, please contact the development team.

---

**Last Updated**: 2024
**Node Version**: 14+
**Package Manager**: npm / yarn