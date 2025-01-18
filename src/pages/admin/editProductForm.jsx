import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../../utils/mediaUpload";

export default function EditProductForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state.product;

  const altNames = product.altNames.join(",");

  if (product == null) {
    navigate("/admin/products");
  }

  const [productId, setProductId] = useState(product.productId);
  const [productName, setProductName] = useState(product.productName);
  const [alternativeNames, setAlternativeNames] = useState(altNames);
  const [imageFiles, setImageFiles] = useState([]);
  const [price, setPrice] = useState(product.price);
  const [lastPrice, setLastPrice] = useState(product.lastPrice);
  const [stock, setStock] = useState(product.stock);
  const [description, setDescription] = useState(product.description);

  async function handleSubmit() {
    const altNames = alternativeNames.split(",");
    let imgUrls = product.images;
    const promisesArray = [];
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        promisesArray[i] = uploadMediaToSupabase(imageFiles[i]);
      }
      imgUrls = await Promise.all(promisesArray);
    }

    const productData = {
      productId: productId,
      productName: productName,
      altNames: altNames,
      images: imgUrls,
      price: price,
      lastPrice: lastPrice,
      stock: stock,
      description: description,
    };
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/products/" + product.productId,
        productData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      navigate("/admin/products");
      toast.success("Product Updated successfully");
    } catch (error) {
      toast.error("Failed to Update product" + error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Edit Product
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Product Name"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alternative Names
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Alternative Names"
              value={alternativeNames}
              onChange={(e) => {
                setAlternativeNames(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URLs
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Image URLs"
              onChange={(e) => {
                setImageFiles(e.target.files);
              }}
              multiple
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Last Price"
              value={lastPrice}
              onChange={(e) => {
                setLastPrice(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Stock Quantity"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Product Description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </form>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
          onClick={handleSubmit}
        >
          Update Product
        </button>
      </div>
    </div>
  );
}
