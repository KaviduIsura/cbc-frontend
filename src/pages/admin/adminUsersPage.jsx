import axios from "axios";
import { useEffect, useState } from "react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      console.log(res.data);
      setUsers(res.data.list);
      setUserLoaded(true);
    });
  }, [userLoaded]);

  return (
    <div className="p-8 min-h-screen bg-gray-100 relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Admin User Page
      </h1>
      {userLoaded ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  User Email
                </th>
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  First Name
                </th>
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  Last Name
                </th>
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  User Role
                </th>
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  Profile Picture
                </th>
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  Block Status
                </th>
                <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                  Manage User
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.type === "customer") // Only include customers
                .map((user, index) => (
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
                    <td className="border border-gray-300 px-4 py-6 flex justify-center items-center">
                      <button
                        className={`text-lg ${
                          user.isBlocked ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {user.isBlocked ? <FaToggleOff /> : <FaToggleOn />}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[60px] h-[60px] border-[4px] border-gray-400 border-b-blue-700 animate-spin rounded-full "></div>
        </div>
      )}
    </div>
  );
}
