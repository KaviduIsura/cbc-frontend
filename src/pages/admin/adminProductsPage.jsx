import axios from "axios";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      console.log(res.data);
      setProducts(res.data.list);
    });
  }, []);

  return (
    <div className="p-8 min-h-screen relative">
      <Link
        to={"/admin/products/addProduct"}
        className="absolute right-[25px] bottom-[25px] text-[25px] bg-white p-4 rounded-xl text-blue-700 border-blue-700 border-[2px] hover:bg-blue-300"
      >
        <FaPlus />
      </Link>
      <h1 className="text-2xl font-bold mb-6">Admin Product Page</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Product Id</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Last Price</th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {product.productId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.productName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${product.lastPrice.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 w-1/4 truncate">
                  {product.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.stock}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaPencilAlt />
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
