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
                const res = await fetch(`/api/data?id=${id}`);
                if (!res.ok) {
                    setError('データを取得できませんでした。IDが正しいか確認してください。');
                    setLoading(false);
                    return;
                }
                const d = await res.json();
                // preferencesには participantName: preferenceList が格納されている
                // しかしtokenで特定のparticipantを探すには、/api/preferencesByToken のようなAPIが必要か、
                // または全データからトークンを探すかが必要。
                // 今回はDBアクセスをAPI層で行うため、新APIを追加するか、
                // preferencesにtokenを返す仕組みが必要になる。

                // 簡易対応：新規APIを作らず、/api/dataでviewTokenを返すようにするか、
                // token→participantNameを特定するAPIを作る。
                // ここでは /api/preferencesByToken?id=...&token=... のAPIを用意する方法を示す。

                // 説明：
                // submissionページではtokenを用いてparticipantNameを特定し、そのpreferencesを表示する必要がある。
                // data APIはviewTokenを返していないので、新たに/api/preferenceByTokenを用意します。

                const prefRes = await fetch(`/api/preferenceByToken?id=${id}&token=${encodeURIComponent(token)}`);
                if (!prefRes.ok) {
                    const errData = await prefRes.json();
                    setError(errData.error || '不明なエラー');
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

    if (loading) return <div style={{ margin: '20px' }}>読み込み中...</div>;

    if (error) {
        return (
            <div style={{ margin: '20px' }}>
                <h1>送信内容確認</h1>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    if (!myPrefs || myPrefs.length === 0) {
        return (
            <div style={{ margin: '20px' }}>
                <h1>送信内容確認</h1>
                <p>データが見つかりませんでした。</p>
            </div>
        );
    }

    return (
        <div style={{ margin: '20px' }}>
            <h1>送信内容確認</h1>
            <p>参加者: {participantName}</p>
            <h2>あなたが送信した優先順位:</h2>
            <ol>
                {myPrefs.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ol>
        </div>
    );
}
