import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.user == null) {
          toast.error(res.data.message);
          return;
        }
        toast.success("Login success");
        localStorage.setItem("token", res.data.token);
        if (res.data.user.type === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      });
  }

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center "
      style={{ backgroundImage: "url('/loginimg.jpg')" }} // Background Image
    >
      <div className="w-[400px] bg-[#ffffff] bg-opacity-50 p-6 rounded-lg shadow-lg flex flex-col items-center border-2 pt-0">
        <div className="w-60 h-60 flex items-center justify-center mb-4">
          <img
            src="/logo1.png"
            alt="Logo"
            className="w-full h-full object-contain rounded-full "
          />
        </div>

        <span className="w-full text-left text-black font-semibold pt-3 ">
          Email
        </span>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 m-2 mt-3 w-full border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EDB065]"
        />
        <span className="w-full text-left text-black font-semibold">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 m-2 mt-3 w-full border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EDB065] "
        />
        <button
          onClick={login}
          className="bg-[#EDB065] text-white px-4 py-2 rounded-md mt-4 hover:bg-[#964623] transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
}
