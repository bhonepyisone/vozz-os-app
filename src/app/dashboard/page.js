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
      <h2 class="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Total Sales</p>
          <h3 class="text-2xl font-bold mt-1">$0.00</h3>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Active Staff</p>
          <h3 class="text-2xl font-bold mt-1">{shop?.roles?.length || 0}</h3>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Inventory Items</p>
          <h3 class="text-2xl font-bold mt-1">0</h3>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500 text-sm">Pending Orders</p>
          <h3 class="text-2xl font-bold mt-1">0</h3>
        </div>
      </div>
    </div>
  );
}