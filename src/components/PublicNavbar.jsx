import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              WriteSpace
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/login")
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/register")
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              }`}
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/login")
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                isActive("/register")
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}