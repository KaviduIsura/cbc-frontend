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

  function login(e) {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        setIsLoading(false);
        console.log("Login response:", res.data); // Debug log
        
        // Check for successful login - updated to handle new response format
        if (res.data.success === true) {
          toast.success(res.data.message || "Welcome back!");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          
          // Use navigate instead of window.location for better React Router integration
          if (res.data.user.type === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          // Handle cases where success is false or not present
          if (res.data.message) {
            toast.error(res.data.message);
          } else {
            toast.error("Login failed - Please try again");
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Login error:", error);
        
        // More detailed error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          
          if (error.response.data?.success === false) {
            toast.error(error.response.data.message || "Login failed");
          } else if (error.response.status === 401) {
            toast.error("Invalid email or password");
          } else if (error.response.status === 403) {
            toast.error("Account is blocked. Please contact administrator.");
          } else if (error.response.status === 404) {
            toast.error("User not found");
          } else if (error.response.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(`Login failed: ${error.response.status}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          toast.error("Cannot connect to server. Please check your connection.");
        } else {
          // Something happened in setting up the request
          console.error("Request setup error:", error.message);
          toast.error("Login failed. Please try again.");
        }
      });
  }

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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org2000/svg" fill="none" viewBox="0 0 24 24">
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

            {/* Social Login (Optional - for future implementation) */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                disabled
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                disabled
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                disabled
              >
                <span className="sr-only">Sign in with Apple</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81a4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.76 3.28-.76 2 .76 3.3.73 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85a4.41 4.41 0 0 1-2.68-4.04z" />
                </svg>
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

            {/* Demo Account Info */}
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