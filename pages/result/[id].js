// pages/result/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ResultPage() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const loadData = async () => {
        if (!id) return;
        try {
            const res = await fetch(`/api/data?id=${id}`);
            if (!res.ok) {
                setError('データを取得できませんでした。IDが正しいか確認してください。');
                setData(null);
                return;
            }
            const d = await res.json();
            setData(d);
            if (d.result) {
                setResult(d.result);
            } else {
                setResult(null);
            }
            setError('');
        } catch (e) {
            console.error(e);
            setError('予期せぬエラーが発生しました。');
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleRun = async () => {
        if (!id) return;
        try {
            const res = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!res.ok) {
                const errorData = await res.json();
                alert('振り分け実行に失敗しました: ' + (errorData.error || 'Unknown error'));
                return;
            }
            const d = await res.json();
            if (d.result) {
                setResult(d.result);
            }
        } catch (e) {
            console.error(e);
            alert('予期せぬエラーが発生しました。');
        }
    };

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-mint">振り分け結果画面</h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <div className="text-text-light">読み込み中...</div>
            </div>
        );
    }

    const participants = data.participants || [];
    const preferences = data.preferences || {};
    const submittedParticipants = Object.keys(preferences); // 入力済み参加者名一覧
    const totalCount = participants.length;
    const submittedCount = submittedParticipants.length;

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-background-light p-8 rounded shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-mint">振り分け結果画面</h1>
            {totalCount > 0 ? (
                <>
                    <div className="mb-6">
                        <p className="font-semibold text-text-light">入力済み参加者:</p>
                        <ul className="list-disc list-inside mt-2 text-text-secondary">
                            {submittedParticipants.map(p => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                        <p className="mt-2 text-text-secondary">合計: {submittedCount} / {totalCount}</p>
                    </div>
                    <button
                        onClick={loadData}
                        className="bg-mint text-background px-4 py-2 rounded hover:bg-mint-light transition mb-4"
                    >
                        更新
                    </button>

                    {!result && submittedCount === totalCount && (
                        <div className="mb-6">
                            <button
                                onClick={handleRun}
                                className="w-full bg-gold text-background px-4 py-3 rounded hover:bg-gold-light transition text-lg font-semibold"
                            >
                                振り分けを実行
                            </button>
                        </div>
                    )}

                    {result && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold mb-4 text-mint">振り分け結果</h2>
                            <ul className="space-y-2">
                                {Object.entries(result).map(([participant, item]) => (
                                    <li key={participant} className="flex justify-between bg-background-light p-3 rounded shadow">
                                        <span className="text-text-light">{participant}</span>
                                        <span className="text-gold font-semibold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-text-light">まだ参加者またはアイテムが設定されていません。</p>
            )}
        </div>
    );
}
