// File: src/app/management/layout.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// This is a special component that wraps our protected pages
export default function ManagementLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) {
      return; // Wait until authentication is done
    }
    if (!user) {
      router.push("/login"); // If no user, send to login
      return;
    }

    // Check the user's role from the database
    const checkRole = async () => {
      const shopRef = doc(db, "shops", user.uid);
      const shopSnap = await getDoc(shopRef);

      if (shopSnap.exists()) {
        const shopData = shopSnap.data();
        const currentUserRole = shopData.roles?.find(r => r.uid === user.uid);
        
        // Only allow access if the role is 'Management'
        if (currentUserRole?.role === 'Management') {
          setIsAuthorized(true);
        } else {
          router.push("/dashboard"); // If wrong role, send to dashboard
        }
      } else {
        router.push("/dashboard"); // If no shop data, send to dashboard
      }
    };

    checkRole();
  }, [user, loading, router]);

  // While checking, show a loading message
  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Verifying access...</p>
      </main>
    );
  }

  // If authorized, show the actual page content
  return <>{children}</>;
}