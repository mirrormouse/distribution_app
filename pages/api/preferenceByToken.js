// pages/api/preferenceByToken.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
    const { id, token } = req.query;

    if (!id || !token) {
        return res.status(400).json({ error: 'idとtokenが必要です' });
    }

    try {
        const pref = await prisma.preference.findFirst({
            where: {
                distributionId: id,
                viewToken: token
            }
        });

        if (!pref) {
            return res.status(404).json({ error: '該当するデータが見つかりません' });
        }

        return res.status(200).json({
            participantName: pref.participantName,
            preferenceList: pref.preferenceList
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
