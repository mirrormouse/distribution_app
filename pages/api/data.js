// pages/api/data.js
import { getDistribution } from '../../lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const dist = await getDistribution(id);
        if (!dist) {
            return res.status(404).json({ error: 'Not found' });
        }

        const participants = dist.participants.map(p => p.name);
        const items = dist.items.map(i => i.name);

        // preferencesは participantName -> preferenceList のマッピングを作る
        const preferencesMap = {};
        dist.preferences.forEach(p => {
            preferencesMap[p.participantName] = p.preferenceList;
        });

        const result = dist.result ? dist.result.assignment : null;

        res.status(200).json({
            participants,
            items,
            preferences: preferencesMap,
            result
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}
