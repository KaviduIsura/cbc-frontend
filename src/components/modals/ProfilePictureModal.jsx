// components/modals/ProfilePictureModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Upload, Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePictureModal = ({ isOpen, onClose, currentPicture, onUpdate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentPicture);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("url"); // "url" or "file"

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setSelectedImage(url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(currentPicture);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    // This is a placeholder - in production, you'd upload to Cloudinary, AWS S3, etc.
    // For now, we'll use a mock URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
      }, 1000);
    });
  };

 // components/modals/ProfilePictureModal.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!selectedImage) {
    toast.error("Please select an image");
    return;
  }

  setLoading(true);
  try {
    let imageUrl = selectedImage;
    
    // If it's a file, upload it first
    if (selectedImage instanceof File) {
      imageUrl = await uploadImageToCloudinary(selectedImage);
    }

    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/profile-picture`,
      { profilePic: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      // Update token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Dispatch custom event to notify Navbar about user update
      window.dispatchEvent(new CustomEvent('userUpdated', { 
        detail: response.data.user 
      }));
      
      toast.success("Profile picture updated successfully");
      onUpdate(imageUrl);
      onClose();
    }
  } catch (error) {
    console.error("Update profile picture error:", error);
    toast.error(error.response?.data?.message || "Failed to update profile picture");
  } finally {
    setLoading(false);
  }
};
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-light">Update Profile Picture</h3>
                <p className="text-sm text-gray-500">Change your profile photo</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Current Preview */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {uploadMethod === "file" ? "Selected image preview" : "Current profile picture"}
                </p>
              </div>

              {/* Upload Method Toggle */}
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadMethod("url")}
                  className={`flex-1 py-2 text-sm font-light transition-colors ${
                    uploadMethod === "url"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 py-2 text-sm font-light transition-colors ${
                    uploadMethod === "file"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* URL Input */}
              {uploadMethod === "url" && (
                <div>
                  <label className="block mb-2 text-sm font-light text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    onChange={handleUrlChange}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Enter a direct link to your profile image
                  </p>
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === "file" && (
                <div>
                  <label className="block mb-2 text-sm font-light text-gray-700">
                    Choose Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="flex items-center justify-center w-full gap-2 p-4 text-sm font-light text-gray-600 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-black hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      Choose an image
                    </label>
                  </div>
                  {selectedImage && selectedImage instanceof File && (
                    <p className="mt-2 text-xs text-gray-500">
                      Selected: {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              )}

              {/* Suggested Images (Optional) */}
              <div>
                <h4 className="mb-3 text-sm font-light text-gray-700">
                  Or choose from defaults
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w-400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        setSelectedImage(url);
                        setImagePreview(url);
                      }}
                      className="relative overflow-hidden rounded-lg aspect-square group"
                    >
                      <img
                        src={url}
                        alt="Profile option"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 transition-opacity opacity-0 bg-black/30 group-hover:opacity-100" />
                      {imagePreview === url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:border-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedImage}
                  className="flex-1 px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Update Picture"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePictureModal;