export default function SignUpPage() {
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/loginimg.jpg')" }}
    >
      <div className="w-[600px] h-[600px] relative bg-white bg-opacity-50 p-6 rounded-lg shadow-lg flex flex-col items-center border-2 pt-0">
        {/* Logo Container */}
        <div className="w-32 h-32 flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <div className="w-full p-8 absolute mt-20">
          <h2 className="text-center text-2xl top-0 font-bold text-gray-900">
            Create your account
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EDB065] focus:border-[#EDB065]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EDB065] focus:border-[#EDB065]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#EDB065] focus:border-[#EDB065]"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#EDB065]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#EDB065] hover:bg-[#964623] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EDB065]"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <a
              href="#"
              className="font-medium text-[#EDB065] hover:text-[#964623]"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
