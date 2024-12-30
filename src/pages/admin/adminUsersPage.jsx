import axios from "axios";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      console.log(res.data);
      setUsers(res.data.list);
    });
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100 relative">
      <Link
        to={"/admin/users/addUser"}
        className="absolute bottom-[25px] right-[25px] text-[25px] bg-white p-4 rounded-full text-blue-900 border-blue-900 border-2 hover:bg-blue-100 shadow-lg"
      >
        <FaPlus />
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Admin User Page
      </h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                First Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Last Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Profile Pic
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Is Blocked
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {user.firstName}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {user.lastName}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 capitalize">
                  {user.type}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  <img
                    src={user.profilePic}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {user.isBlocked ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-6 flex gap-5 justify-center items-center">
                  <button className="text-blue-900 hover:text-blue-700">
                    <FaPencilAlt />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
