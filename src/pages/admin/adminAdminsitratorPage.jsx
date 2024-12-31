import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminAdminstratorPage() {
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
      <Link
        to={"/admin/admin/addAdmin"}
        className="absolute bottom-[25px] right-[25px] text-[25px] bg-white p-4 rounded-full text-blue-900 border-blue-900 border-2 hover:bg-blue-100 shadow-lg"
      >
        <FaPlus />
      </Link>
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
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.type === "admin") // Only include customers
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
