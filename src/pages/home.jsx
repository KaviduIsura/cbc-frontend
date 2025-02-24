import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import LoginPage from "./login";
import ProductOverview from "./home/productOverview";
import ProductPage from "./home/product";
import Cart from "./home/cart";
import Landing from "./home/landing";
import Footer from "../components/footer";
import AboutUs from "./home/aboutus";

export default function HomePage() {
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="w-full h-[calc(100vh-100px)]">
        <Routes path="/*">
          <Route path="/" element={<Landing />}></Route>
          <Route path="/products" element={<ProductPage />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/about-us" element={<AboutUs/>}></Route>
          <Route path="/productInfo/:id" element={<ProductOverview />}></Route>
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
