// File: src/components/TopNav.js
"use client";
import { useState } from 'react';

export default function TopNav({ shopName, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const userInitials = user?.email?.substring(0, 2).toUpperCase() || '..';

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-indigo-700">Vozz OS</h1>
          <span className="ml-4 px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded">
            Shop: {shopName || 'Loading...'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                <span>{userInitials}</span>
              </div>
              <span className="hidden md:inline">{user?.email}</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                <a href="#" onClick={onLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
