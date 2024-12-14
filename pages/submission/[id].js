// pages/submission/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SubmissionPage() {
    const router = useRouter();
    const { id, token } = router.query;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [participantName, setParticipantName] = useState('');
    const [myPrefs, setMyPrefs] = useState([]);

    useEffect(() => {
        if (!id || !token) return;
        const fetchData = async () => {
            try {
                const prefRes = await fetch(`/api/preferenceByToken?id=${id}&token=${encodeURIComponent(token)}`);
                if (!prefRes.ok) {
                    const errData = await prefRes.json();
                    setError(errData.error || 'データを取得できませんでした。');
                    setLoading(false);
                    return;
                }
                const prefData = await prefRes.json();
                setParticipantName(prefData.participantName);
                setMyPrefs(prefData.preferenceList);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setError('予期せぬエラーが発生しました。');
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    if (loading) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <div className="text-text-light">読み込み中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-mint">送信内容確認</h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!myPrefs || myPrefs.length === 0) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-mint">送信内容確認</h1>
                <p className="text-text-light">
                    あなた(<span className="font-semibold">{participantName}</span>)はまだ優先順位を送信していないようです。
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-mint">送信内容確認</h1>
            <p className="text-text-light mb-4">
                参加者: <span className="font-semibold">{participantName}</span>
            </p>
            <h2 className="font-semibold text-text-light mb-2">あなたが送信した優先順位:</h2>
            <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                {myPrefs.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ol>
        </div>
    );
}
