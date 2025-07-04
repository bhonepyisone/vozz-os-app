// File: src/app/inventory/page.js
"use client";
import { useState } from 'react';

export default function InventoryPage() {
    const [items, setItems] = useState([
        { id: 1, name: 'Coffee Beans', stock: '10 kg', supplier: 'A' },
        { id: 2, name: 'Milk', stock: '20 Liters', supplier: 'B' },
    ]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
                {/* Add form would go here */}
                <p className="text-gray-500">Item creation form will be implemented in a future step.</p>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Current Stock</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Item Name</th>
                            <th className="p-2">Stock Level</th>
                            <th className="p-2">Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.stock}</td>
                                <td className="p-2">{item.supplier}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}