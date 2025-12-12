import { Route, Routes } from "react-router-dom";
import ProductOverview from "./home/productOverview";
import ProductPage from "./home/Product";
import Cart from "./home/cart";
import Landing from "./home/Landing";
import Layout from "../components/Layout";
import OurStoryPage from "./home/OurStory";
import JournalPage from "./home/Journal";
import RitualsPage from "./home/RitualsPage";
import IngredientsIndex from "./home/ingredients/IngredientsIndex";
import OudPage from "./home/ingredients/OudPage";
import SaffronPage from "./home/ingredients/SaffronPage";
import ArganPage from "./home/ingredients/ArganPage";
import SandalwoodPage from "./home/ingredients/SandalwoodPage";
import Wishlist from "./home/Wishlist";
import Checkout from "./home/Checkout";
import MyOrders from "./home/MyOrders";
import OrderDetails from "./home/OrderDetails";
import AccountPage from './home/AccountPage'

export default function HomePage() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Shop Routes */}
        <Route path="/shop">
          <Route index element={<ProductPage />} />
          <Route path="all" element={<ProductPage />} />
          <Route path="perfumes" element={<ProductPage />} />
          <Route path="skincare" element={<ProductPage />} />
          <Route path="makeup" element={<ProductPage />} />
          <Route path="tools" element={<ProductPage />} />
        </Route>

        {/* Product Detail */}
        <Route path="/product/:id" element={<ProductOverview />} />

        {/* Cart & Wishlist */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        {/* Content Pages */}
        <Route path="/story" element={<OurStoryPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/rituals" element={<RitualsPage />} />

        {/* Ingredients Pages */}
        <Route path="/ingredients">
          <Route index element={<IngredientsIndex />} />
          <Route path="oud" element={<OudPage />} />
          <Route path="saffron" element={<SaffronPage />} />
          <Route path="argan" element={<ArganPage />} />
          <Route path="sandalwood" element={<SandalwoodPage />} />
        </Route>
        
        <Route path="/account" element={<AccountPage />} />
        {/* Fallback route - 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-[60vh] pt-20">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-light">404</h1>
                <p className="mb-6 text-gray-600">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
