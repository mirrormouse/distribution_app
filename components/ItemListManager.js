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
            <h3 className="text-lg font-semibold mb-2 text-text-light">アイテム</h3>
            <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
                <input
                    placeholder="アイテム名"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="border border-border-light rounded px-3 py-2 bg-background-light text-text-light focus:ring-2 focus:ring-mint transition-colors w-full sm:w-auto"
                />
                <button
                    onClick={handleAdd}
                    className="bg-mint text-background px-4 py-2 rounded hover:bg-mint-light transition w-full sm:w-auto"
                >
                    追加
                </button>
            </div>
            <ul className="space-y-2">
                {items.map((i, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-background-light p-3 rounded shadow">
                        <span className="text-text-light">{i}</span>
                        <button
                            onClick={() => onRemove(i)}
                            className="text-gold hover:text-gold-light underline"
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
