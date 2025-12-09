import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import SignupImg from '../assets/signup.jpg'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your signup logic here
    console.log("Signup data:", formData);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect or show success message
    }, 1500);
  };

  const passwordStrength = formData.password.length > 0 
    ? formData.password.length < 6 ? "weak" 
    : formData.password.length < 10 ? "good" 
    : "strong"
    : "";

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white">
      {/* Left side - Background Image */}
      <div className="relative hidden h-screen lg:block lg:w-1/2">
        <div 
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${SignupImg})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute text-white bottom-12 left-12">
            <div className="mb-2 text-2xl font-light tracking-wider">ELEVÉ</div>
            <p className="text-sm opacity-90">Join our beauty community</p>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
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

          {/* Logo and Header */}
          <div className="mb-8 text-center">
            <div className="mb-2 text-3xl font-light tracking-wider">ELEVÉ</div>
            <p className="text-gray-500">Create your account</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-light text-gray-600">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-3 text-sm transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-3 text-sm transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-light text-gray-600">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-10 text-sm transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Create a password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordStrength === "weak" ? "bg-red-400" :
                      passwordStrength === "good" ? "bg-yellow-400" : "bg-green-400"
                    }`}></div>
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordStrength === "weak" ? "bg-gray-200" :
                      passwordStrength === "good" ? "bg-yellow-400" : "bg-green-400"
                    }`}></div>
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordStrength === "weak" ? "bg-gray-200" :
                      passwordStrength === "good" ? "bg-gray-200" : "bg-green-400"
                    }`}></div>
                    <span className="ml-2 text-xs font-light text-gray-500">
                      {passwordStrength === "weak" ? "Weak" :
                       passwordStrength === "good" ? "Good" : "Strong"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Use 8+ characters with letters and numbers
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-light text-gray-600">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-10 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                    formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black focus:ring-black"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree-terms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="agree-terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="font-light text-black underline hover:text-gray-600">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="font-light text-black underline hover:text-gray-600">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.agreeTerms || (formData.password !== formData.confirmPassword)}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-light tracking-wider text-white transition-colors bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Account <ArrowRight className="w-4 h-4 ml-2" />
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
                <span className="px-2 text-gray-500 bg-white">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="sr-only">Sign up with Google</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="sr-only">Sign up with Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="sr-only">Sign up with Apple</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.76 3.28-.76 2 .76 3.3.73 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z" />
                </svg>
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-8 text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-light text-black underline transition-colors hover:text-gray-600"
              >
                Sign in here
              </Link>
            </p>

            {/* Benefits List */}
            {/* <div className="p-4 mt-8 rounded-lg bg-gray-50">
              <p className="mb-3 text-sm font-light text-gray-600">When you create an account:</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Save your beauty preferences</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Track your orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Access exclusive member offers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Get personalized product recommendations</span>
                </li>
              </ul>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}