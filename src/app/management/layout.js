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

    // Check the user's role from their own user document
    const checkRole = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === 'Management') {
        setIsAuthorized(true);
      } else {
        // If not a manager, send to dashboard
        router.push("/dashboard");
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