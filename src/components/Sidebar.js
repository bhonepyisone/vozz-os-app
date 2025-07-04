// File: src/components/Sidebar.js
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', role: ['Management', 'Front Desk', 'Staff'] },
  { name: 'Point of Sale', href: '/pos', role: ['Management', 'Front Desk', 'Staff'] },
  { name: 'Inventory', href: '/inventory', role: ['Management', 'Front Desk'] },
  { name: 'Management', href: '/management', role: ['Management'] },
];

export default function Sidebar({ userRole, onLogout }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-sidebar-bg border-r">
      <h2 className="text-3xl font-semibold text-white">Vozz OS</h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {navLinks.map((link) => (
            link.role.includes(userRole) && (
              <Link key={link.name} href={link.href} className={`flex items-center px-4 py-2 mt-5 rounded-md transition-colors duration-300 transform ${pathname === link.href ? 'bg-sidebar-active text-white' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-gray-200'}`}>
                <span className="mx-4 font-medium">{link.name}</span>
              </Link>
            )
          ))}
        </nav>
        <button onClick={onLogout} className="w-full px-4 py-2 mt-5 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80">
          Log Out
        </button>
      </div>
    </div>
  );
}