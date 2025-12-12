import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from '../assets/login.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`, 
        {
          email: email,
          password: password,
        }
      );
      
      if (response.data.success && response.data.token) {
        const { token, user, message } = response.data;
        
        // Store authentication data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        toast.success(message || "Login successful!");
        
        // Force a small delay to ensure state is updated
        setTimeout(() => {
          if (user.type === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/";
          }
        }, 100);
        
      } else {
        toast.error(response.data.message || "Login failed");
      }
      
    } catch (error) {
      // Improved error handling
      if (error.response) {
        const { status, data } = error.response;
        
        switch(status) {
          case 400:
            toast.error(data.message || "Invalid request");
            break;
          case 401:
            toast.error("Invalid email or password");
            break;
          case 403:
            toast.error("Account is blocked. Please contact administrator.");
            break;
          case 404:
            toast.error("User not found");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(data.message || `Login failed (${status})`);
        }
      } else if (error.request) {
        toast.error("Cannot connect to server. Please check your internet connection.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Test admin login function
  const testAdminLogin = () => {
    setEmail("kavidu100@example.com");
    setPassword("securepassword123");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back to Home */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm font-light text-gray-500 transition-colors hover:text-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-2 text-3xl font-light tracking-wider">ELEVÉ</div>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={login} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block mb-2 text-sm font-light text-gray-600">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-3 text-sm transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-light text-gray-600">
                  Password
                </label>
                <a href="#" className="text-xs font-light text-gray-500 transition-colors hover:text-black">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-10 text-sm transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-light tracking-wider text-white transition-colors bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">Or continue with</span>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={testAdminLogin}
                className="px-4 py-2 text-xs font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                disabled={isLoading}
              >
                Fill Admin Credentials
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("customer@example.com");
                  setPassword("password123");
                }}
                className="px-4 py-2 text-xs font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                disabled={isLoading}
              >
                Fill Customer Credentials
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="font-light text-black underline transition-colors hover:text-gray-600"
              >
                Create account
              </Link>
            </p>

            {/* Demo Account Info - Optional: Remove or keep as needed */}
            <div className="p-4 mt-6 text-xs text-gray-500 rounded-lg bg-gray-50">
              <p className="mb-1 font-medium">Demo Account</p>
              <p>Email: kavidu100@example.com</p>
              <p>Password: securepassword123</p>
            </div>

            {/* Terms */}
            <p className="mt-4 text-xs text-center text-gray-400">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-gray-600">Terms</a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Background Image */}
      <div className="relative hidden h-screen lg:block lg:w-1/2">
        <div 
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${LoginImg})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute text-white bottom-12 left-12">
            <div className="mb-2 text-2xl font-light tracking-wider">ELEVÉ</div>
            <p className="text-sm opacity-90">Cultural Beauty, Modernly Crafted</p>
          </div>
        </div>
      </div>
    </div>
  );
}