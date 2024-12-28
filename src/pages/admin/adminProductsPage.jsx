import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductLoaded] = useState(false);

  useEffect(() => {
    if (!productsLoaded) {
      axios.get("http://localhost:5000/api/products").then((res) => {
        console.log(res.data);
        setProducts(res.data.list);
        setProductLoaded(true);
      });
    }
  }, [productsLoaded]);

  return (
    <div className="p-8 min-h-screen bg-gray-100 relative">
      <Link
        to={"/admin/products/addProduct"}
        className="absolute right-[25px] bottom-[25px] text-[25px] bg-white p-4 rounded-full text-blue-900 border-blue-900 border-2 hover:bg-blue-100 shadow-lg"
      >
        <FaPlus />
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Admin Product Page
      </h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Product Id
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Product Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Last Price
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold w-1/5">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Stock
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {product.productId}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {product.productName}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  ${product.lastPrice.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 truncate w-1/5">
                  {product.description.length > 50
                    ? `${product.description.slice(0, 50)}...`
                    : product.description}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                  {product.stock}
                </td>
                <td className="border border-gray-300 px-4 py-3 flex gap-4 justify-center items-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      axios
                        .delete(
                          `http://localhost:5000/api/products/${product.productId}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        )
                        .then((res) => {
                          console.log(res.data);
                          toast.success("Product deleted successfully");
                          setProductLoaded(false);
                        });
                    }}
                  >
                    <FaTrash />
                  </button>
                  <button className="text-blue-900 hover:text-blue-900">
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
