// pages/api/run.js
import { getDistribution, setResult } from '../../lib/db';
import { runMatching } from '../../lib/algorithm';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.body;

    try {
        const dist = await getDistribution(id);
        if (!dist) {
            return res.status(404).json({ error: 'Not found' });
        }

        const preferencesMap = {};
        dist.preferences.forEach(pref => {
            preferencesMap[pref.participantName] = pref.preferenceList;
        });

        if (Object.keys(preferencesMap).length !== dist.participants.length) {
            return res.status(400).json({ error: 'Not all participants have submitted their preferences' });
        }

        const participants = dist.participants.map(p => p.name);
        const items = dist.items.map(i => i.name);

        const result = runMatching(participants, items, preferencesMap);
        await setResult(id, result);
        return res.status(200).json({ result });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
