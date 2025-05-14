import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import { useAuth } from "../AuthProvider";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => navigate("/")} role="button">
            <img src="/logo.svg" alt="Reach Optimizer Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-orange-800 dark:text-orange-300">
              Reach Optimizer
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200 transition-colors"
            >
              Testimonials
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-orange-700 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-orange-700 dark:text-orange-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-in fade-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-orange-100 dark:border-orange-800/30">
                {user ? (
                  <Button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 rounded-lg transition-colors"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/signup");
                        setIsMenuOpen(false);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
