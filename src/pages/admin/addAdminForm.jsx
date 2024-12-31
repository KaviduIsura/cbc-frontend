import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [type] = useState("admin"); // Default role is "admin"

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent form submission reload
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePic: image,
      password: password,
      type: type, // Role is always "admin"
    };
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/users", user, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      navigate("/admin/admins");
      toast.success("User Added Successfully");
    } catch (error) {
      toast.error("Failed To add User: " + error.message);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Add User Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            User Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Profile Picture URL
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter profile picture URL"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
