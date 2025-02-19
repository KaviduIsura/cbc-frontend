import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Cart", path: "/cart" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-accent opacity-100 w-full h-24 flex justify-between items-center px-[100px] shadow-md sticky top-0 z-50">
      <Link to="/">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-24 w-24 object-cover rounded-full"
        />
      </Link>

      <nav className="hidden md:flex space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-white font-semibold text-lg transition duration-300 hover:text-gray-300 pb-1 border-b-2 ${
              location.pathname === link.path
                ? "border-white"
                : "border-transparent"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Icon */}
      <button className="md:hidden text-white" onClick={toggleMenu}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-24 left-0 w-full bg-accent shadow-md md:hidden">
          <div className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-white font-semibold text-lg hover:text-gray-300 transition ${
                  location.pathname === link.path ? "underline" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
