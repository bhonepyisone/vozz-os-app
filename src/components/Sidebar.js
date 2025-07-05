// File: src/components/Sidebar.js
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: 'fa-tachometer-alt', roles: ['Management', 'Front Desk', 'Staff'] },
  { name: 'Point of Sale', href: '/pos', icon: 'fa-cash-register', roles: ['Management', 'Front Desk', 'Staff'] },
  { name: 'Inventory', href: '/inventory', icon: 'fa-boxes', roles: ['Management', 'Front Desk'] },
  { name: 'Management', href: '/management', icon: 'fa-user-shield', roles: ['Management'] },
];

export default function Sidebar({ userRole }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-indigo-800 text-white h-screen fixed top-0 left-0 pt-16">
      <div className="overflow-y-auto h-full pb-20 px-4 py-4">
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              (userRole && link.roles.includes(userRole)) && (
                <li key={link.name}>
                  <Link href={link.href} className={`flex items-center px-4 py-3 rounded-lg transition ${pathname === link.href ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
                    <i className={`fas ${link.icon} mr-3`}></i>
                    <span>{link.name}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}