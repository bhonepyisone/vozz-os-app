// File: src/app/management/page.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';

export default function ManagementPage() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');

  const fetchShopData = useCallback(async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().shopId) {
      const shopRef = doc(db, 'shops', userSnap.data().shopId);
      const shopSnap = await getDoc(shopRef);
      if (shopSnap.exists()) {
        setShop({ id: shopSnap.id, ...shopSnap.data() });
      }
    }
  }, [user]);

  useEffect(() => { fetchShopData(); }, [fetchShopData]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    if (!inviteEmail || !shop) return;
    if (shop.roles.some(role => role.email === inviteEmail)) {
        setError('This user is already a member of the shop.');
        return;
    }
    try {
      const inviteRef = doc(db, "invites", inviteEmail.toLowerCase().trim());
      await setDoc(inviteRef, { shopId: shop.id, shopName: shop.shopName, role: inviteRole, invitedBy: user.email });
      const shopRef = doc(db, 'shops', shop.id);
      await updateDoc(shopRef, { roles: arrayUnion({ email: inviteEmail.toLowerCase().trim(), role: inviteRole, uid: null }) });
      setInviteEmail('');
      setInviteRole('Staff');
      await fetchShopData();
    } catch (err) { setError('Failed to send invite.'); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Invite New Staff</h2>
        <form onSubmit={handleInvite}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Staff's email address" className="flex-grow p-2 border rounded-md" required/>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="Staff">Staff</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Management">Management</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Send Invite</button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Current Staff</h2>
        <div className="space-y-4">
          {shop?.roles?.map((member, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{member.email}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
              <div className={`px-3 py-1 text-sm rounded-full ${member.uid ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                {member.uid ? 'Active' : 'Invited'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
