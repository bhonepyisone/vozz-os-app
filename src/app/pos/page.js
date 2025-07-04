// File: src/app/pos/page.js
"use client";
import { useState } from 'react';

// Mock data - in a real app, this would come from your inventory in Firestore
const menuItems = [
  { id: 1, name: 'Espresso', price: 2.50 },
  { id: 2, name: 'Latte', price: 3.50 },
  { id: 3, name: 'Cappuccino', price: 3.50 },
  { id: 4, name: 'Croissant', price: 2.75 },
  { id: 5, name: 'Muffin', price: 3.00 },
  { id: 6, name: 'Tea', price: 2.00 },
];

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (item) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="flex h-full">
      {/* Menu Items */}
      <div className="w-3/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-4 overflow-y-auto">
        {menuItems.map(item => (
          <div key={item.id} onClick={() => addToCart(item)} className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer hover:shadow-xl transition-shadow">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-500">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="w-2/5 bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold border-b pb-4">Current Order</h2>
        <div className="flex-grow overflow-y-auto mt-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">No items in order.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{item.name} x{item.quantity}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={() => alert('Checkout functionality not yet implemented.')} className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-700">
            Charge
          </button>
        </div>
      </div>
    </div>
  );
}
