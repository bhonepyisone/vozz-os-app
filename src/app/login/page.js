// File: src/app/login/page.js
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to sign in. Please check your email and password.");
      console.error(err);
    }
  };

  const handleSignup = async () => {
    setError(null);
    try {
      // Step 1: Create the user in Firebase Auth and a basic user document
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Step 2: Check if an invite exists for this new user's email
      const inviteRef = doc(db, "invites", user.email.toLowerCase().trim());
      const inviteSnap = await getDoc(inviteRef);

      if (inviteSnap.exists()) {
        // This is an invited user!
        const inviteData = inviteSnap.data();
        const { shopId, role } = inviteData;

        // Step 3: Update the user's document with the shopId and role from the invite
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          shopId: shopId,
          role: role,
        });

        // Step 4: Update the shop's roles array to make the user 'Active' by adding their UID
        const shopRef = doc(db, "shops", shopId);
        const shopSnap = await getDoc(shopRef);
        if (shopSnap.exists()) {
          const shopData = shopSnap.data();
          const updatedRoles = shopData.roles.map(r => 
            r.email === user.email.toLowerCase().trim() ? { ...r, uid: user.uid } : r
          );
          await updateDoc(shopRef, { roles: updatedRoles });
        }

        // Step 5: Delete the invite so it cannot be used again
        await deleteDoc(inviteRef);
        
        console.log("Successfully onboarded invited user!");
      }
      
      // Step 6: Redirect to the dashboard. The main layout will handle routing correctly now.
      router.push("/dashboard");

    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">Vozz OS Portal</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" placeholder="you@example.com"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" placeholder="••••••••"/>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={handleLogin} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign In</button>
            <button onClick={handleSignup} className="w-full px-4 py-2 font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">Sign Up Instead</button>
          </div>
        </div>
      </div>
    </main>
  );
}
