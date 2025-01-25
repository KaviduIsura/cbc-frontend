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
        if ((res.data.user.type === "admin")) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      });
  }
  return (
    <div className="w-full h-screen bg-slate-400 flex items-center justify-center">
      <div className="w-[500px] h-[500px] bg-slate-600 flex flex-col justify-center items-center ">
        <img src="/logo.jpge.jpg" alt="" className="rounded-full w-[100px]" />
        <span>Email</span>
        <input
          type="text"
          defaultValue={email}
          onChange={(e) => {
            //console.log(e.target.value);
            setEmail(e.target.value);
          }}
        />
        <span>Password</span>
        <input
          type="password"
          defaultValue={password}
          onChange={(e) => {
            //console.log(e.target.value);
            setPassword(e.target.value);
          }}
        />
        <button onClick={login} className="bg-white">
          Login
        </button>
      </div>
    </div>
  );
}
