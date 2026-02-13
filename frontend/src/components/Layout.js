import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3" data-testid="nav-logo">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SB</span>
              </div>
              <span className="text-2xl font-bold font-outfit text-slate-900">SkillBridge</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/find-work" data-testid="nav-find-work">
                <Button variant="ghost" className="text-slate-700 hover:text-primary">
                  Find Work
                </Button>
              </Link>
              <Link to="/hire-talent" data-testid="nav-hire-talent">
                <Button variant="ghost" className="text-slate-700 hover:text-primary">
                  Hire Talent
                </Button>
              </Link>
              <Link to="/categories" data-testid="nav-categories">
                <Button variant="ghost" className="text-slate-700 hover:text-primary">
                  Categories
                </Button>
              </Link>
              <Link to="/pricing" data-testid="nav-pricing">
                <Button variant="ghost" className="text-slate-700 hover:text-primary">
                  Pricing
                </Button>
              </Link>
              <Link to="/about" data-testid="nav-about">
                <Button variant="ghost" className="text-slate-700 hover:text-primary">
                  About
                </Button>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(user.user_type === "client" ? "/client-dashboard" : "/worker-dashboard")}
                    data-testid="nav-dashboard-button"
                  >
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="outline" data-testid="nav-logout-button">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" data-testid="nav-login-link">
                    <Button variant="outline" className="border-primary text-primary hover:bg-blue-50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/login?type=signup" data-testid="nav-signup-link">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white" data-testid="mobile-menu">
            <div className="px-4 py-3 space-y-2">
              <Link to="/find-work" className="block py-2 text-slate-700" data-testid="mobile-find-work">
                Find Work
              </Link>
              <Link to="/hire-talent" className="block py-2 text-slate-700" data-testid="mobile-hire-talent">
                Hire Talent
              </Link>
              <Link to="/categories" className="block py-2 text-slate-700" data-testid="mobile-categories">
                Categories
              </Link>
              <Link to="/pricing" className="block py-2 text-slate-700" data-testid="mobile-pricing">
                Pricing
              </Link>
              <Link to="/about" className="block py-2 text-slate-700" data-testid="mobile-about">
                About
              </Link>
              {user ? (
                <>
                  <button
                    onClick={() => navigate(user.user_type === "client" ? "/client-dashboard" : "/worker-dashboard")}
                    className="block w-full text-left py-2 text-slate-700"
                    data-testid="mobile-dashboard"
                  >
                    Dashboard
                  </button>
                  <button onClick={handleLogout} className="block w-full text-left py-2 text-slate-700" data-testid="mobile-logout">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-primary font-medium" data-testid="mobile-login">
                    Login
                  </Link>
                  <Link to="/login?type=signup" className="block py-2 text-primary font-medium" data-testid="mobile-signup">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-outfit font-bold text-xl mb-4" data-testid="footer-logo">SkillBridge</h3>
              <p className="text-slate-400 text-sm">Connecting South Africa's Best Talent with the World</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <div className="space-y-2 text-sm">
                <Link to="/hire-talent" className="block text-slate-400 hover:text-white" data-testid="footer-hire-talent">Hire Talent</Link>
                <Link to="/pricing" className="block text-slate-400 hover:text-white" data-testid="footer-pricing">Pricing</Link>
                <Link to="/categories" className="block text-slate-400 hover:text-white" data-testid="footer-categories">Categories</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Workers</h4>
              <div className="space-y-2 text-sm">
                <Link to="/find-work" className="block text-slate-400 hover:text-white" data-testid="footer-find-work">Find Work</Link>
                <Link to="/login" className="block text-slate-400 hover:text-white" data-testid="footer-create-profile">Create Profile</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block text-slate-400 hover:text-white" data-testid="footer-about">About Us</Link>
                <Link to="/contact" className="block text-slate-400 hover:text-white" data-testid="footer-contact">Contact</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 SkillBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
