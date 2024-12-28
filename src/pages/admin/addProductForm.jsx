import { useState } from "react";

export default function AddProductForm() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [alternativeNames, setAlternativeNames] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [price, setPrice] = useState("");
  const [lasrPrice, setLastPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    console.log({
      productId,
      productName,
      alternativeNames,
      imageUrls,
      price,
      lasrPrice,
      stock,
      description,
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add Product
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
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
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter Image URLs"
              value={imageUrls}
              onChange={(e) => {
                setImageUrls(e.target.value);
              }}
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
              value={lasrPrice}
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
              onClick={(e) => {
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
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
            onClick={handleSubmit}
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
