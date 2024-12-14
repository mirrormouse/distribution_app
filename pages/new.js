// pages/new.js
import { useState } from 'react';
import ParticipantListManager from '../components/ParticipantListManager';
import ItemListManager from '../components/ItemListManager';

export default function NewPage() {
    const [participants, setParticipants] = useState([]);
    const [items, setItems] = useState([]);
    const [createdLink, setCreatedLink] = useState(null);
    const [resultLink, setResultLink] = useState(null);

    const addParticipant = (p) => setParticipants([...participants, p]);
    const removeParticipant = (p) => setParticipants(participants.filter(x => x !== p));

    const addItem = (i) => setItems([...items, i]);
    const removeItem = (i) => setItems(items.filter(x => x !== i));

    const handleCreate = async () => {
        if (participants.length === 0 || items.length === 0) {
            alert('参加者とアイテムを1つ以上追加してください。');
            return;
        }

        // 参加者数とアイテム数の関係は以前のまま
        if (participants.length !== items.length) {
            alert('参加者数とアイテム数を同じにしてください。');
            return;
        }

        const res = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participants, items })
        });

        if (!res.ok) {
            alert('振り分け作成に失敗しました。');
            return;
        }

        const data = await res.json();
        if (data.id) {
            setCreatedLink(`${window.location.origin}/preferences/${data.id}`);
            setResultLink(`${window.location.origin}/result/${data.id}`);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">新しい振り分け作成</h1>
            <ParticipantListManager
                participants={participants}
                onAdd={addParticipant}
                onRemove={removeParticipant}
            />
            <ItemListManager
                items={items}
                onAdd={addItem}
                onRemove={removeItem}
            />

            <button
                onClick={handleCreate}
                className="bg-brand text-white px-4 py-2 rounded hover:bg-brand/90 transition"
            >
                振り分けリンク作成
            </button>

            {createdLink && (
                <div className="mt-6">
                    <p className="font-semibold mb-2">参加者用選好入力リンク:</p>
                    {/* リンクがクリック可能で分かるように text-blue-600 underline */}
                    <a
                        href={createdLink}
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {createdLink}
                    </a>
                </div>
            )}
            {resultLink && (
                <div className="mt-6">
                    <p className="font-semibold mb-2">結果確認用リンク(ホスト用):</p>
                    {/* こちらのリンクも同様にスタイリング */}
                    <a
                        href={resultLink}
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {resultLink}
                    </a>
                </div>
            )}
        </div>
    );
}
