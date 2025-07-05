// File: src/app/layout.js
"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import "@fortawesome/fontawesome-free/css/all.min.css";

// This is the main RootLayout that provides the Auth context
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

// This new AppShell component handles all the logic for displaying the correct layout
function AppShell({ children }) {
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
      if (pathname !== '/login' && pathname !== '/setup') {
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

  // Routes that should NOT have the sidebar/topnav
  const noAppShellRoutes = ['/login', '/setup'];
  if (noAppShellRoutes.includes(pathname) || !user) {
    return <>{children}</>;
  }

  // Loading state for when we are fetching user/shop data
  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading Application...</p>
      </div>
    );
  }

  // The main application layout with the sidebar and top navigation
  return (
    <div className="bg-gray-50">
      <Sidebar userRole={userData?.role} />
      <TopNav shopName={shopData?.shopName} user={user} onLogout={handleLogout} />
      <div className="ml-64 pt-16">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}