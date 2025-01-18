import "./App.css";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/signPage";
import AdminHomePage from "./pages/adminHomePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Toaster />
        <Routes path="/*">
          <Route path="/*" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SigninPage />}></Route>
          <Route path="/admin/*" element={<AdminHomePage />}></Route>
          <Route path="/*" element={<HomePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
//VITE_BACKEND_URL =https://cbc-backend-ps3j.onrender.com
