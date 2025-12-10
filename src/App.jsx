import "./App.css";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/signPage";
import AdminHomePage from "./pages/adminHomePage";
import { Toaster } from "react-hot-toast";
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <div>
      <CartProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* All public routes go through HomePage */}
          <Route path="/*" element={<HomePage />} />
          
          {/* Auth pages without Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SigninPage />} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminHomePage />} />
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;