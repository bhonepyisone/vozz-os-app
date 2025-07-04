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
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await handleLogout();
          return;
        }

        const fetchedUserData = userSnap.data();
        setUserData(fetchedUserData);

        if (!fetchedUserData.shopId) {
          router.push("/setup");
          return;
        }

        const shopRef = doc(db, "shops", fetchedUserData.shopId);
        const shopSnap = await getDoc(shopRef);

        if (shopSnap.exists()) {
          setShop(shopSnap.data());
        } else {
          console.error("Shop not found, but user has a shopId.");
          await handleLogout();
        }
      } catch (error) {
        console.error("Failed to fetch data, likely a permissions issue:", error);
        await handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, loading, router]);

  if (isLoading) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading...</p>
        </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">
          {shop?.shopName || "Shop"}
        </h1>
        <p className="mt-2 text-lg text-gray-500">Dashboard</p>
        
        <div className="mt-8 text-left border-t pt-6">
            <p className="text-lg"><span className="font-semibold">Welcome:</span> {user.email}</p>
            <p className="text-lg"><span className="font-semibold">Your Role:</span> <span className="font-bold text-indigo-600">{userData?.role || 'Not Assigned'}</span></p>
        </div>

        {userData?.role === 'Management' && (
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
