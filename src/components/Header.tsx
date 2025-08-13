import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Package, Warehouse, Settings, Menu, X, LogOut } from "lucide-react";

interface HeaderProps {
  isAdminLoggedIn?: boolean;
  onAdminLogout?: () => void;
}

export const Header = ({ isAdminLoggedIn = false, onAdminLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Procurement", href: "/procurement", icon: Package },
    { name: "Inventory", href: "/inventory", icon: Warehouse },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-900">Veerashri Heights</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 border-b-2 ${
                    active
                      ? "border-blue-700 text-blue-700"
                      : "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300"
                  } text-sm font-medium transition-colors duration-200`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Logout Button */}
          {isAdminLoggedIn && (
            <div className="hidden md:flex">
              <Button
                onClick={onAdminLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}


          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-blue-100">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 border-b-2 ${
                      active
                        ? "border-blue-700 text-blue-700"
                        : "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300"
                    } text-base font-medium transition-colors duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {isAdminLoggedIn && (
                <Button
                  onClick={() => {
                    onAdminLogout?.();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center space-x-1 border-red-200 text-red-600 hover:bg-red-50 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Admin Logout</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

