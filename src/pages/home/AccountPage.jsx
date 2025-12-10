// pages/AccountPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Edit2, 
  Shield,
  CreditCard,
  MapPin,
  Package,
  LogOut,
  Check,
  X,
  Loader
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../../components/modals/EditProfileModal";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import ProfilePictureModal from "../../components/modals/ProfilePictureModal";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  
  const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Failed to load account information");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Handle profile update
  const handleProfileUpdate = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
    setShowEditProfileModal(false);
  };

  // Handle profile picture update
  const handleProfilePictureUpdate = (newProfilePic) => {
    setUser(prev => ({
      ...prev,
      profilePic: newProfilePic
    }));
    setShowProfilePictureModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-sm font-light text-gray-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="mb-2 text-lg font-light">No user found</h3>
          <p className="mb-6 text-gray-500">Please login to view your account</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-6 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light">My Account</h1>
              <p className="text-gray-500">Manage your profile and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container px-6 py-12 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="p-6 bg-white rounded-lg">
              {/* Profile Summary */}
              <div className="mb-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                  <img
                    src={user.profilePic}
                    alt={user.firstName}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => setShowProfilePictureModal(true)}
                    className="absolute bottom-0 right-0 p-2 text-white bg-black rounded-full"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="text-lg font-light">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 mt-2 text-xs bg-gray-100 rounded-full">
                  <Shield className="w-3 h-3" />
                  <span className="capitalize">{user.type} Account</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-light rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-light rounded-lg transition-colors ${
                    activeTab === "security"
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Security & Password
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-light rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-light rounded-lg transition-colors ${
                    activeTab === "addresses"
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Saved Addresses
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-light rounded-lg transition-colors ${
                    activeTab === "payment"
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Payment Methods
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white rounded-lg"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-light">Profile Information</h2>
                    <p className="text-gray-500">Update your personal details</p>
                  </div>
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-light text-black transition-colors border border-black rounded-lg hover:bg-black hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      First Name
                    </label>
                    <div className="p-3 font-light border border-gray-200 rounded-lg">
                      {user.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      Last Name
                    </label>
                    <div className="p-3 font-light border border-gray-200 rounded-lg">
                      {user.lastName}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-light">{user.email}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      Account Type
                    </label>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="font-light capitalize">{user.type} Account</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      Member Since
                    </label>
                    <div className="p-3 font-light border border-gray-200 rounded-lg">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white rounded-lg"
              >
                <div className="mb-8">
                  <h2 className="mb-2 text-xl font-light">Security Settings</h2>
                  <p className="text-gray-500">Manage your password and account security</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-light">Password</h3>
                        <p className="text-sm text-gray-500">Update your password regularly</p>
                      </div>
                      <button
                        onClick={() => setShowChangePasswordModal(true)}
                        className="px-4 py-2 text-sm font-light text-black transition-colors border border-black rounded-lg hover:bg-black hover:text-white"
                      >
                        Change Password
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        ))}
                      </div>
                      <span className="text-gray-500">Your password is encrypted</span>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-light">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:border-black">
                        Enable 2FA
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Two-factor authentication adds an additional layer of security to your account.
                    </p>
                  </div>

                  <div className="p-6 border border-red-100 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-light text-red-800">Delete Account</h3>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <button className="px-4 py-2 text-sm font-light text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                    <p className="text-sm text-red-600">
                      Warning: This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white rounded-lg"
              >
                <div className="mb-8">
                  <h2 className="mb-2 text-xl font-light">My Orders</h2>
                  <p className="text-gray-500">View and manage your orders</p>
                </div>
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="mb-2 text-lg font-light">No orders yet</h3>
                  <p className="text-gray-500">Start shopping to see your orders here</p>
                  <button
                    onClick={() => navigate("/shop")}
                    className="px-6 py-3 mt-4 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                  >
                    Start Shopping
                  </button>
                </div>
              </motion.div>
            )}

            {/* Add other tabs content similarly */}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <ProfilePictureModal
        isOpen={showProfilePictureModal}
        onClose={() => setShowProfilePictureModal(false)}
        currentPicture={user.profilePic}
        onUpdate={handleProfilePictureUpdate}
      />
    </div>
  );
};

export default AccountPage;