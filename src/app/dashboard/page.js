// File: src/app/dashboard/page.js
"use client";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchShopData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().shopId) {
        const shopRef = doc(db, "shops", userSnap.data().shopId);
        const shopSnap = await getDoc(shopRef);
        if (shopSnap.exists()) {
          setShop(shopSnap.data());
        }
      }
    };
    fetchShopData();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back to {shop?.shopName || "your shop"}!</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Today&apos;s Sales</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Active Staff</h3>
          <p className="text-3xl font-bold mt-2">{shop?.roles?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Inventory Items</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}