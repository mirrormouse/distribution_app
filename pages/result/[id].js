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
            <div style={{ margin: '20px' }}>
                <h1>振り分け結果画面（ホスト用）</h1>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    if (!data) {
        return <div style={{ margin: '20px' }}>読み込み中...</div>;
    }

    const participants = data.participants || [];
    const preferences = data.preferences || {};
    const submittedCount = Object.keys(preferences).length;
    const totalCount = participants.length;

    const submittedParticipants = Object.keys(preferences); // 入力済み参加者名一覧

    return (
        <div style={{ margin: '20px' }}>
            <h1>振り分け結果画面（ホスト用）</h1>
            {totalCount > 0 ? (
                <>
                    <p>入力済み: {submittedCount} / {totalCount}</p>
                    {/* 入力済み参加者一覧を表示 */}
                    <ul>
                        {submittedParticipants.map(p => (
                            <li key={p}>{p}</li>
                        ))}
                    </ul>
                    <button onClick={loadData}>更新</button>

                    {!result && submittedCount === totalCount && (
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={handleRun}>振り分けを実行</button>
                        </div>
                    )}

                    {result && (
                        <div style={{ marginTop: '20px' }}>
                            <h2>結果</h2>
                            <ul>
                                {Object.entries(result).map(([participant, item]) => (
                                    <li key={participant}>{participant} → {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <p>まだ参加者またはアイテムが設定されていません。</p>
            )}
        </div>
    );
}
