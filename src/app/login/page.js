// File: src/app/login/page.js
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleAuth = async (authAction) => {
    setError(null);
    try {
      const userCredential = await authAction(email, password);
      const user = userCredential.user;

      // Check for an invite
      const inviteRef = doc(db, "invites", user.email);
      const inviteSnap = await getDoc(inviteRef);

      if (inviteSnap.exists()) {
        // Handle invited user logic here (will be completed in a future step)
        console.log("Invited user signed up!");
      }
      
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
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
            <button onClick={() => handleAuth(login)} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign In</button>
            <button onClick={() => handleAuth(signup)} className="w-full px-4 py-2 font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">Sign Up Instead</button>
          </div>
        </div>
      </div>
    </main>
  );
}
