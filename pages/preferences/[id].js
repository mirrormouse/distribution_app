// pages/preferences/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PreferenceOrderEditor from '../../components/PreferenceOrderEditor';

export default function PreferencesPage() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);
    const [participant, setParticipant] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/data?id=${id}`);
                if (!res.ok) {
                    setError('データを取得できませんでした。IDが正しいか確認してください。');
                    return;
                }
                const d = await res.json();
                setData(d);
                if (d.participants && d.participants.length > 0) {
                    setParticipant(d.participants[0]);
                }
                if (d.items) {
                    setPreferences(d.items);
                }
            } catch (e) {
                console.error(e);
                setError('予期せぬエラーが発生しました。');
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        if (!participant || preferences.length === 0) {
            alert('参加者と優先順位が正しく設定されていません。');
            return;
        }
        try {
            const res = await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, participant, preferences })
            });
            if (!res.ok) {
                const errorData = await res.json();
                alert('選好送信に失敗しました: ' + (errorData.error || 'Unknown error'));
                return;
            }
            setSubmitted(true);
        } catch (e) {
            console.error(e);
            alert('予期せぬエラーが発生しました。');
        }
    };

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">選好入力画面</h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <div>読み込み中...</div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">選好入力画面</h1>
                <p>選好を送信しました。ありがとうございました。</p>
                <p className="mt-4">
                    <a
                        href={`/result/${id}`}
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        結果を見る（ホストが実行後にアクセス）
                    </a>
                </p>
            </div>
        );
    }

    const participants = data.participants || [];

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">選好入力画面</h1>
            {participants.length === 0 ? (
                <p>参加者情報がありません。IDを確認してください。</p>
            ) : (
                <>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">
                            あなたの名前を選択してください:
                        </label>
                        <select
                            value={participant}
                            onChange={e => setParticipant(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
                        >
                            {participants.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <h2 className="font-semibold mb-2">アイテムの優先順位</h2>
                        <p className="text-sm text-gray-600 mb-4">ドラッグ＆ドロップでアイテムの並び順を変更できます。最も上が欲しいもの（1位）です。</p>
                        <PreferenceOrderEditor
                            items={preferences}
                            onChange={(newItems) => setPreferences(newItems)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-brand text-white px-4 py-2 rounded hover:bg-brand/90 transition"
                    >
                        送信
                    </button>
                </>
            )}
        </div>
    );
}
