// pages/preferences/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PreferenceOrderEditor from '../../components/PreferenceOrderEditor';

export default function PreferencesPage() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);
    const [participant, setParticipant] = useState(''); // 初期値を空文字に設定
    const [preferences, setPreferences] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [viewToken, setViewToken] = useState('');
    const [submitError, setSubmitError] = useState(''); // 送信時のエラー用ステートを追加

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
                // デフォルトで参加者を選択しないように変更
                // if (d.participants && d.participants.length > 0) {
                //   setParticipant(d.participants[0]);
                // }
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
        // 送信時にエラーをリセット
        setSubmitError('');
        if (!participant) {
            setSubmitError('名前を選択してください。');
            return;
        }
        if (preferences.length === 0) {
            setSubmitError('優先順位が正しく設定されていません。');
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
                alert('優先順位送信に失敗しました: ' + (errorData.error || '不明なエラー'));
                return;
            }
            const responseData = await res.json();
            setViewToken(responseData.viewToken);
            setSubmitted(true);
        } catch (e) {
            console.error(e);
            alert('予期せぬエラーが発生しました。');
        }
    };

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-mint">参加者用入力画面</h1>
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

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-background-light p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-mint">参加者用入力画面</h1>
                <p className="text-text-secondary mb-4">優先順位を送信しました。ありがとうございました。</p>
                {/* トークン付きURLを表示 */}
                <p>
                    <a
                        href={`/submission/${id}?token=${encodeURIComponent(viewToken)}`}
                        className="text-mint underline hover:text-mint-light transition"
                    >
                        自分の送信内容を見る
                    </a>
                </p>
            </div>
        );
    }

    const participants = data.participants || [];

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-background-light p-8 rounded shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-mint">参加者用入力画面</h1>
            {participants.length === 0 ? (
                <p className="text-text-light">参加者情報がありません。IDを確認してください。</p>
            ) : (
                <>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-text-light">
                            あなたの名前を選択してください:
                        </label>
                        <select
                            value={participant}
                            onChange={e => setParticipant(e.target.value)}
                            className="border border-border-light rounded px-4 py-2 bg-background-light text-text-light focus:ring-2 focus:ring-mint transition-colors w-full"
                        >
                            <option value="" disabled>
                                -- 名前を選択してください --
                            </option>
                            {participants.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        {/* 送信時のエラーメッセージを表示 */}
                        {submitError && (
                            <p className="text-red-600 mt-2">{submitError}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="font-semibold text-text-light mb-2">アイテムの優先順位</h2>
                        <p className="text-sm text-text-secondary mb-4">ドラッグ＆ドロップでアイテムの並び順を変更できます。最も上が欲しいもの（1位）です。</p>
                        <PreferenceOrderEditor
                            items={preferences}
                            onChange={(newItems) => setPreferences(newItems)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-mint text-background px-4 py-3 rounded hover:bg-mint-light transition text-lg font-semibold"
                    >
                        送信
                    </button>
                </>
            )}
        </div>
    );
}
