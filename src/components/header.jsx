import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-accent w-full h-[100px] relative flex justify-center items-center">
      <img
        src="/logo.png"
        className="cursor-pointer h-full rounded-full absolute left-[10px]"
        alt=""
      />
      <div className="h-full flex items-center w-[600px] justify-evenly">
        <Link
          to={"/"}
          className="text-white font-bold text-xl hover:border-b border-b-white "
        >
          Home
        </Link>
        <Link
          to={"/products"}
          className="text-white font-bold text-xl hover:border-b border-b-white "
        >
          Products
        </Link>
        <Link
          to={"/"}
          className="text-white font-bold text-xl hover:border-b border-b-white "
        >
          About Us
        </Link>
        <Link
          to={"/"}
          className="text-white font-bold text-xl hover:border-b border-b-white "
        >
          Contact Us
        </Link>
      </div>
    </header>
  );
}
