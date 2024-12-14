// components/ItemListManager.js
import { useState } from 'react';

export default function ItemListManager({ items, onAdd, onRemove }) {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        const name = input.trim();
        if (name && !items.includes(name)) {
            onAdd(name);
            setInput('');
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">アイテム</h3>
            <div className="flex gap-2 items-center mb-4">
                <input
                    placeholder="アイテム名"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                    onClick={handleAdd}
                    className="bg-brand text-white px-3 py-1 rounded hover:bg-brand/90 transition"
                >
                    追加
                </button>
            </div>
            <ul className="space-y-2">
                {items.map((i, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-white shadow p-3 rounded">
                        <span className="text-gray-800">{i}</span>
                        <button
                            onClick={() => onRemove(i)}
                            className="text-red-500 hover:text-red-700 underline"
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
