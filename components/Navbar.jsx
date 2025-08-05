import { useState } from 'react';
import { Menu, X, LogOut, Bell, User } from 'lucide-react';
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';

import Link from "next/link";



export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };


  return (
    <nav className="relative bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-md shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">Shipsy</span>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">

            {/* User Profile */}
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-200">{session?.user ? (
        <span className="username">
          {session.user.name || session.user.username}
        </span>
      ) : (
        <Link href="/login">Login</Link>
      )}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition"
            >Logout
              
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white transition hover:bg-white/10 rounded-md"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-3 space-y-2 border-t border-white/10">
            {/* Profile */}
            <div className="flex items-center px-4 space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">John Doe</span>
                <span className="text-xs text-gray-400">john@shipsy.com</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
