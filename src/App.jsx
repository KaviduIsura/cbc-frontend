// src/App.jsx
import "./App.css";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/signPage";
import AdminHomePage from "./pages/adminHomePage";
import { Toaster } from "react-hot-toast";
import { CartProvider } from './context/CartContext';
import ConfigProviderWrapper from './components/ConfigProviderWrapper';

function App() {
  return (
    <ConfigProviderWrapper>
      <CartProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/*" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SigninPage />} />
            <Route path="/admin/*" element={<AdminHomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ConfigProviderWrapper>
  );
}

export default App;