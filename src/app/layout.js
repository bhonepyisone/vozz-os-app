// File: src/app/layout.js
"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./globals.css"; // Keep this
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

// Font Awesome - Add this to load the icons
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  const [shopData, setShopData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      if (pathname !== '/login') {
        router.push('/login');
      }
      setIsDataLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsDataLoading(true);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const uData = userSnap.data();
        setUserData(uData);
        if (uData.shopId) {
          const shopRef = doc(db, "shops", uData.shopId);
          const shopSnap = await getDoc(shopRef);
          if (shopSnap.exists()) {
            setShopData(shopSnap.data());
          }
        } else {
          if (pathname !== '/setup') router.push('/setup');
        }
      }
      setIsDataLoading(false);
    };
    fetchData();
  }, [user, loading, pathname, router]);

  const noAppShellRoutes = ['/login', '/setup'];
  if (noAppShellRoutes.includes(pathname) || !user) {
    return <>{children}</>;
  }

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading Application...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50">
      <Sidebar userRole={userData?.role} />
      <div className="flex-1 ml-64">
        <TopNav shopName={shopData?.shopName} user={user} onLogout={handleLogout} />
        <main className="pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}