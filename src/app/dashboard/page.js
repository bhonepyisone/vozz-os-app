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

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchShopData = async () => {
        setShopLoading(true);
        const shopRef = doc(db, "shops", user.uid);
        const shopSnap = await getDoc(shopRef);
        
        if (shopSnap.exists()) {
          const shopData = shopSnap.data();
          if (!shopData.shopName) {
            // If shop name is empty, redirect to setup
            router.push("/setup");
          } else {
            setShop(shopData);
          }
        } else {
          // This case can happen if signup failed to create a shop doc
          // or for users created before this feature was added.
          console.error("Shop document not found! Redirecting to setup.");
          router.push("/setup");
        }
        setShopLoading(false);
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

  // While redirecting, don't show anything
  if (!shop) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800">
          {shop.shopName}
        </h1>
        <p className="mt-2 text-lg text-gray-500">Dashboard</p>
        <div className="mt-8 border-t pt-6">
            <p className="text-lg text-gray-700">
            Welcome, <span className="font-semibold">{user.email}</span>!
            </p>
            <p className="mt-2 text-sm text-gray-400">
            Temporary Shop ID: {shop.tempId}
            </p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="mt-8 px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}
