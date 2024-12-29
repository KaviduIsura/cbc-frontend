import "./App.css";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/signPage";
import AdminHomePage from "./pages/adminHomePage";
import { Toaster } from "react-hot-toast";
import FileUploadTest from "./pages/test";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Toaster />
        <Routes path="/*">
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SigninPage />}></Route>
          <Route path="/admin/*" element={<AdminHomePage />}></Route>
          <Route path="/*" element={<HomePage />}></Route>
          <Route path="/testing" element={<FileUploadTest />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
