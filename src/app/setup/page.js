// File: src/app/setup/page.js
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function SetupPage() {
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to set up a shop.");
      return;
    }

    if (shopName.trim().length < 3) {
      setError("Shop name must be at least 3 characters long.");
      return;
    }

    try {
      const shopRef = doc(db, "shops", user.uid);
      await updateDoc(shopRef, {
        shopName: shopName.trim(),
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to update shop name. Please try again.");
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Set Up Your Shop
        </h1>
        <p className="text-center text-gray-600">
          Give your shop a permanent name to continue.
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-gray-700"
            >
              Shop Name
            </label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., The Corner Cafe"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save and Continue
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
