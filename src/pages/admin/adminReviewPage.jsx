import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/reviews", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("API Response:", res.data);
        setReviews(res.data.message);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100 relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
        Customer Reviews
      </h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Customer Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Profile Picture
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Rating
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Review Content
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <tr
                  key={review._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    {review.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <img
                      src={review.profilePic || "/placeholder.jpg"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <span className="text-yellow-500 font-semibold">
                      {review.rating}
                    </span>{" "}
                    / 5
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    {review.review}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <button
                      className={`px-4 py-2 rounded-full text-xs font-bold ${
                        review.hidden
                          ? "bg-red-100 text-red-500 hover:bg-red-200"
                          : "bg-green-100 text-green-500 hover:bg-green-200"
                      }`}
                    >
                      {review.hidden ? "Hidden" : "Visible"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center border border-gray-300 px-4 py-6 text-gray-500"
                >
                  No reviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
