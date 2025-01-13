import { Routes } from "react-router-dom";
import Header from "../components/header";

export default function HomePage() {
  return (
    <div className="h-screen w-full">
      <Header />
      <Routes path="/"></Routes>
    </div>
  );
}
