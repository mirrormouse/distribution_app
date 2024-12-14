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

        // アイテム数が参加者数以上であることを確認
        if (items.length < participants.length) {
            alert('アイテム数は参加者数以上にしてください。（参加者よりアイテムが少ない状態は不可）');
            return;
        }

        const res = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participants, items })
        });

        if (!res.ok) {
            const errData = await res.json();
            alert('振り分け作成に失敗しました: ' + (errData.error || '不明なエラー'));
            return;
        }

        const data = await res.json();
        if (data.id) {
            setCreatedLink(`${window.location.origin}/preferences/${data.id}`);
            setResultLink(`${window.location.origin}/result/${data.id}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-background-light p-8 rounded shadow-lg">
            <h1 className="text-3xl font-bold mb-8 text-mint">新しい振り分け作成</h1>
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
                className="w-full bg-mint text-background px-4 py-3 rounded hover:bg-mint-light transition text-lg font-semibold"
            >
                振り分けリンク作成
            </button>

            {createdLink && (
                <div className="mt-6 p-4 bg-background-light rounded">
                    <p className="font-semibold mb-2 text-text-light">参加者用優先順位入力リンク:</p>
                    <a
                        href={createdLink}
                        className="block text-mint underline hover:text-mint-light transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {createdLink}
                    </a>
                </div>
            )}
            {resultLink && (
                <div className="mt-6 p-4 bg-background-light rounded">
                    <p className="font-semibold mb-2 text-text-light">送信状況確認、振り分け実行用リンク:</p>
                    <a
                        href={resultLink}
                        className="block text-mint underline hover:text-mint-light transition"
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
