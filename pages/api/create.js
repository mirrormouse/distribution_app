// pages/api/create.js
import { createDistribution } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { participants, items } = req.body;
    if (!participants || !items || participants.length === 0 || items.length === 0) {
        return res.status(400).json({ error: '参加者とアイテムを1つ以上指定してください。' });
    }

    // ここで条件を変更
    // アイテム数 < 参加者数の場合のみエラー
    if (items.length < participants.length) {
        return res.status(400).json({ error: 'アイテム数は参加者数以上にしてください。' });
    }

    try {
        const id = await createDistribution(participants, items);
        res.status(200).json({ id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}
