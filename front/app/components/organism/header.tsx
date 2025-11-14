"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hiddenRoutes = ["/sign_up", "/login", "/not-found"];

  // Verificamos si coincide exactamente con alguna
  const hideHeader = hiddenRoutes.includes(pathname);

  // Inicializar tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Cambiar tema
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

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
    <header className={`header ${hideHeader ? "hidden" : ""}`}>
      {/* Logo */}
      <div className="logo" onClick={() => router.push("/")}>
        <div className="logo-icon">K</div>
        <span>KILA</span>
      </div>

      {/* Nav (se puede dejar vacío o quitar si breadcrumbs van en page) */}
      <nav className="header-nav">
        {/* Breadcrumbs van en page.tsx */}
      </nav>

      {/* User Menu */}
      <div className="user-menu" ref={dropdownRef}>
        {/* Toggle tema */}
        <button className="btn btn-ghost" onClick={toggleTheme}>
          <span>{isDarkMode ? "☀️" : "🌙"}</span>
        </button>

        {/* Avatar */}
        <div className="user-avatar" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          AP
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: 0,
              width: "12rem",
              backgroundColor: "var(--secondary-800)",
              border: "1px solid var(--secondary-700)",
              borderRadius: "8px",
              boxShadow: "var(--shadow-xl)",
              zIndex: 50,
              padding: "0.5rem",
            }}
          >
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                color: "var(--error)"
              }}
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
