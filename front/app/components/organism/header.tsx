"use client";
import Image from "next/image.js";
import { usePathname, useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import Lika from "@/public/Lika.png";
import { IoMoonOutline } from "react-icons/io5";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hiddenRoutes = ["/sign_up", "/login", "/not-found"];

  // Verificamos si coincide exactamente con alguna
  const hideHeader = hiddenRoutes.includes(pathname);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <header
      className={`h-20 p-2.5 bg-secondary-800 flex justify-between items-center ${
        hideHeader ? "hidden" : ""
      }`}
    >
      <div
        className="relative w-25 h-20 mr-2.5 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src={Lika} alt="Logo" fill className="object-contain" />
      </div>

      <div>
        <p className="font-bold text-primary-500">Validación DIAN</p>
      </div>
      <div className="relative flex gap-10 items-center" ref={dropdownRef}>
        <button className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer">
          <IoMoonOutline className="text-white hover:text-primary-500 w-full h-full" />
        </button>

        <button
          className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaRegUserCircle className="text-primary-500 hover:text-green w-full h-full" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-hard-gray border-2 border-soft-gray rounded-md shadow-lg z-50 p-2">
            <button
              onClick={handleLogout}
              className="w-full p-2 text-red-700 hover:bg-soft-gray hover:text-red-500 transition-colors duration-200 rounded-md"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
