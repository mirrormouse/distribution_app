// pages/api/create.js
import { createDistribution } from '../../lib/db';

export default async function handler(req, res) {
    console.log(`API /api/create called with method: ${req.method}`);

    if (req.method !== 'POST') {
        console.log(`Method ${req.method} not allowed`);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { participants, items } = req.body;
    if (!participants || !items || participants.length === 0 || items.length === 0) {
        console.log('Bad request: participants or items are missing or empty');
        return res.status(400).json({ error: '参加者とアイテムを1つ以上指定してください。' });
    }

    if (items.length < participants.length) {
        console.log('Bad request: items are fewer than participants');
        return res.status(400).json({ error: 'アイテム数は参加者数以上にしてください。' });
    }

    try {
        const id = await createDistribution(participants, items);
        console.log(`Distribution created with ID: ${id}`);
        res.status(200).json({ id });
    } catch (e) {
        console.error('Error creating distribution:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}
