// File: src/app/layout.js
"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppContent({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      if (pathname !== '/login' && pathname !== '/setup') {
        router.push('/login');
      }
      return;
    }

    const fetchUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        if (!data.shopId && pathname !== '/setup') {
            router.push('/setup');
        }
      }
    };
    fetchUserData();
  }, [user, loading, pathname, router]);

  const noSidebarRoutes = ['/login', '/setup'];
  if (noSidebarRoutes.includes(pathname) || !user) {
    return <>{children}</>;
  }

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading Application...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar userRole={userData.role} onLogout={handleLogout} />
      <main className="flex-1 p-10 bg-gray-100 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
