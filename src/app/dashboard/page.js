// File: src/app/dashboard/page.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [isShopLoading, setShopLoading] = useState(true);

  // A more robust logout handler
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login.
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // If there is a user, fetch their shop data.
    if (user) {
      const fetchShopData = async () => {
        setShopLoading(true);
        try {
          const shopRef = doc(db, "shops", user.uid);
          const shopSnap = await getDoc(shopRef);

          if (shopSnap.exists()) {
            const shopData = shopSnap.data();
            // Explicitly check for an empty shop name.
            if (shopData.shopName === "") {
              router.push("/setup");
            } else {
              setShop(shopData);
            }
          } else {
            // This can happen if the shop document wasn't created properly.
            console.error("Shop document not found for user:", user.uid);
            router.push("/setup");
          }
        } catch (error) {
          console.error("Error fetching shop data:", error);
          // If there's a database error, log out to be safe.
          await handleLogout();
        } finally {
          setShopLoading(false);
        }
      };

      fetchShopData();
    }
  }, [user, loading, router]);

  // Show a loading screen while we wait for user auth and shop data.
  if (loading || isShopLoading) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading...</p>
        </main>
    );
  }

  // If we're done loading but there's no user or shop, it means we are redirecting.
  // Render nothing to avoid a flash of content.
  if (!user || !shop) {
    return null;
  }

  // If everything is loaded and data is present, show the dashboard.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          {shop.shopName}
        </h1>
        <p className="mt-2 text-lg text-gray-500">Dashboard</p>
        <p className="mt-8 text-lg text-gray-600">
          Welcome, {user.email}!
        </p>
         <p className="mt-2 text-sm text-gray-400">
          Temporary Shop ID: {shop.tempId}
        </p>
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