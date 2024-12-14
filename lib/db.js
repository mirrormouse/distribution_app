// lib/db.js
import prisma from './prisma.js';

export async function createDistribution(participants, items) {
    const created = await prisma.distribution.create({
        data: {
            participants: { create: participants.map(p => ({ name: p })) },
            items: { create: items.map(i => ({ name: i })) }
        },
        include: {
            participants: true,
            items: true
        }
    });
    return created.id;
}

export async function getDistribution(id) {
    return prisma.distribution.findUnique({
        where: { id },
        include: {
            participants: true,
            items: true,
            preferences: true,
            result: true
        }
    });
}

export async function addPreference(id, participant, preferenceList) {
    const pref = await prisma.preference.create({
        data: {
            participantName: participant,
            preferenceList: preferenceList,
            distributionId: id
        }
    });
    return pref.viewToken; // 作成時にcuid()で生成されたviewTokenを返す
}

export async function getPreferenceByToken(token) {
    return prisma.preference.findUnique({
        where: { viewToken: token },
    });
}

export async function setResult(id, result) {
    await prisma.result.create({
        data: {
            distributionId: id,
            assignment: result
        }
    });
}
