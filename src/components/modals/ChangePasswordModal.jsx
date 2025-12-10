// components/modals/ChangePasswordModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Eye, EyeOff, Loader, Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else if (passwordStrength < 3) {
      newErrors.newPassword = "Password is too weak";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Number check
    if (/\d/.test(password)) strength += 1;
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength for new password
    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        onClose();
      }
    } catch (error) {
      console.error("Change password error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.response?.data?.message || "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
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
                <h3 className="text-lg font-light">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block mb-2 text-sm font-light text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.currentPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block mb-2 text-sm font-light text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength <= 1 ? 'text-red-500' :
                        passwordStrength === 2 ? 'text-yellow-500' :
                        passwordStrength === 3 ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-light text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.newPassword && formData.confirmPassword && (
                  <div className="flex items-center gap-1 mt-1">
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-500">Passwords do not match</span>
                    )}
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-2 text-sm font-light text-gray-700">Password Requirements</h4>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    At least 6 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    Contains uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /\d/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    Contains number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    Contains special character
                  </li>
                </ul>
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
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Changing...
                    </span>
                  ) : (
                    "Change Password"
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

export default ChangePasswordModal;