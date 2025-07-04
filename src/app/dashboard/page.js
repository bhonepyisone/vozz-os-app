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
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchShopData = async () => {
        const shopRef = doc(db, "shops", user.uid);
        const shopSnap = await getDoc(shopRef);
        setShopLoading(false);

        if (shopSnap.exists()) {
          const shopData = shopSnap.data();
          if (!shopData.shopName) {
            // If shop name is empty, redirect to setup
            router.push("/setup");
          } else {
            setShop(shopData);
          }
        } else {
          // This case might happen if signup failed to create a shop doc
          console.error("Shop document not found!");
          router.push("/setup");
        }
      };

      fetchShopData();
    }
  }, [user, loading, router]);

  if (loading || isShopLoading) {
    return <p>Loading...</p>;
  }

  if (!user || !shop) {
    // This state is temporary while redirecting
    return null;
  }

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
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="mt-8 px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}
