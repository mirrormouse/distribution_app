// pages/api/preferences.js
import { getDistribution, addPreference } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, participant, preferences } = req.body;
    try {
        const dist = await getDistribution(id);
        if (!dist) {
            return res.status(404).json({ error: 'Not found' });
        }

        // 同一participantからの重複送信チェック
        const alreadySubmitted = dist.preferences.some(pref => pref.participantName === participant);
        if (alreadySubmitted) {
            return res.status(400).json({ error: 'すでに選好を送信済みです' });
        }

        if (!participant || !preferences || preferences.length !== dist.items.length) {
            return res.status(400).json({ error: 'Invalid preference data' });
        }
        const setCheck = new Set(preferences);
        if (setCheck.size !== preferences.length) {
            return res.status(400).json({ error: 'Duplicate items in preferences' });
        }

        const viewToken = await addPreference(id, participant, preferences);
        return res.status(200).json({ success: true, viewToken });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
