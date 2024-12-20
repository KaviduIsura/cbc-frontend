import { Link, Route, Routes } from 'react-router-dom';
import { GoGraph } from "react-icons/go"; // Icon for Dashboard
import { FaBox, FaShoppingCart, FaUsers } from "react-icons/fa"; // Icons for Products, Orders, and Customers
import AdminProductsPage from './admin/adminProductsPage';

export default function AdminHomePage() {
    return (
        <div className="bg-gray-100 w-full h-screen flex">
            {/* Sidebar */}
            <div className="bg-blue-900 w-[20%] h-screen flex flex-col items-center py-6">
                <h1 className="text-gray-200 text-2xl font-bold mb-10">Admin Panel</h1>
                <Link 
                    className="flex flex-row items-center text-gray-100 mb-6 w-[90%] p-3 rounded hover:bg-blue-700 transition duration-200" 
                    to="/admin/dashboard"
                >
                    <GoGraph className="mr-3 text-xl" />
                    Dashboard
                </Link>
                <Link 
                    className="flex flex-row items-center text-gray-100 mb-6 w-[90%] p-3 rounded hover:bg-blue-700 transition duration-200" 
                    to="/admin/products"
                >
                    <FaBox className="mr-3 text-xl" />
                    Products
                </Link>
                <Link 
                    className="flex flex-row items-center text-gray-100 mb-6 w-[90%] p-3 rounded hover:bg-blue-700 transition duration-200" 
                    to="/admin/orders"
                >
                    <FaShoppingCart className="mr-3 text-xl" />
                    Orders
                </Link>
                <Link 
                    className="flex flex-row items-center text-gray-100 mb-6 w-[90%] p-3 rounded hover:bg-blue-700 transition duration-200" 
                    to="/admin/customers"
                >
                    <FaUsers className="mr-3 text-xl" />
                    Customers
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="w-[80%] bg-gray-100 h-screen flex items-center justify-center">
               
                <Routes path='/*'>
                <Route path='/dashboard' element={<h2 className="text-gray-800 text-3xl font-semibold">Dashboard</h2>}></Route>
                <Route path='/products' element={<AdminProductsPage/>}></Route>
                <Route path='/orders' element={<h2 className="text-gray-800 text-3xl font-semibold">Orders</h2>}></Route>
                <Route path='/customers' element={<h2 className="text-gray-800 text-3xl font-semibold">Customers</h2>}></Route>
                <Route path='/*' element={<h2 className="text-gray-800 text-3xl font-semibold">Welcome to the Admin Panel</h2>}></Route>
                </Routes>
            </div>
        </div>
    );
}
