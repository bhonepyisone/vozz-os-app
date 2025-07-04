// File: src/app/dashboard/page.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isShopLoading, setShopLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchShopData = async () => {
        setShopLoading(true);
        try {
          const shopRef = doc(db, "shops", user.uid);
          const shopSnap = await getDoc(shopRef);

          if (shopSnap.exists()) {
            const shopData = shopSnap.data();
            if (shopData.shopName === "") {
              router.push("/setup");
            } else {
              setShop(shopData);
              // Find the current user's role in the roles array
              const currentUserRole = shopData.roles?.find(r => r.uid === user.uid);
              if (currentUserRole) {
                setUserRole(currentUserRole.role);
              }
            }
          } else {
            router.push("/setup");
          }
        } catch (error) {
          console.error("Error fetching shop data:", error);
          await handleLogout();
        } finally {
          setShopLoading(false);
        }
      };

      fetchShopData();
    }
  }, [user, loading, router]);

  if (loading || isShopLoading) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading...</p>
        </main>
    );
  }

  if (!user || !shop) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">
          {shop.shopName}
        </h1>
        <p className="mt-2 text-lg text-gray-500">Dashboard</p>
        
        <div className="mt-8 text-left border-t pt-6">
            <p className="text-lg"><span className="font-semibold">Welcome:</span> {user.email}</p>
            <p className="text-lg"><span className="font-semibold">Your Role:</span> <span className="font-bold text-indigo-600">{userRole || 'Not Assigned'}</span></p>
            <p className="text-sm text-gray-400 mt-1"><span className="font-semibold">Shop ID:</span> {shop.tempId}</p>
        </div>

        {/* This link will only be shown to users with the 'Management' role */}
        {userRole === 'Management' && (
            <div className="mt-6 border-t pt-6">
                <Link href="/management" className="px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                    Go to Management Area
                </Link>
            </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-8 px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}
