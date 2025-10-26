// ============================================================================
// Header Component - Google-inspired Navigation
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store/userStore";
import { useUIStore } from "@/lib/store/uiStore";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Settings,
  Home,
  Archive,
  Info,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

// ----------------------------------------------------------------------------
// Navigation Links
// ----------------------------------------------------------------------------

const navLinks: NavLink[] = [
  { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  { name: "Archive", href: "/search", icon: <Archive className="w-4 h-4" /> },
  { name: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
];

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default function Header() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useUserStore();
  const { mobileMenuOpen, setMobileMenuOpen, openLoginModal } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-normal",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white",
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-google-blue transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-google-blue to-white rounded-lg flex items-center justify-center text-white font-bold">
              IB
            </div>
            <span className="hidden sm:inline">Inspiration Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-google-blue/10 text-google-blue"
                    : "text-foreground hover:bg-muted hover:text-google-blue",
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <Link
              href="/search"
              className="p-2 rounded-lg text-muted-foreground hover:text-google-blue hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* User Section */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="User menu"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm font-medium text-foreground">
                    {user.username}
                  </span>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-google-red hover:bg-muted transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-google-blue text-white hover:bg-[hsl(214,90%,48%)] transition-colors text-sm font-medium"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-google-blue/10 text-google-blue"
                      : "text-foreground hover:bg-muted",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
