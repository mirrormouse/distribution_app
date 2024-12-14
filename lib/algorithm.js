// lib/algorithm.js
// ハンガリアン法＋参加者順序ランダム化

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function hungarian(costMatrix) {
    const n = costMatrix.length;
    const u = Array(n + 1).fill(0);
    const v = Array(n + 1).fill(0);
    const p = Array(n + 1).fill(0);
    const way = Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = Array(n + 1).fill(Infinity);
        const used = Array(n + 1).fill(false);
        do {
            used[j0] = true;
            const i0 = p[j0];
            let j1 = 0;
            let delta = Infinity;
            for (let j = 1; j <= n; j++) {
                if (!used[j]) {
                    const cur = costMatrix[i0 - 1][j - 1] - u[i0] - v[j];
                    if (cur < minv[j]) {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if (minv[j] < delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            for (let j = 0; j <= n; j++) {
                if (used[j]) {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (p[j0] !== 0);
        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }

    const assignment = Array(n).fill(-1);
    for (let j = 1; j <= n; j++) {
        assignment[p[j] - 1] = j - 1;
    }
    return assignment;
}

function buildCostMatrix(scoreMatrix) {
    const rowCount = scoreMatrix.length;
    const colCount = scoreMatrix[0].length;
    const n = Math.max(rowCount, colCount);

    let maxScore = 0;
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if (scoreMatrix[i][j] > maxScore) {
                maxScore = scoreMatrix[i][j];
            }
        }
    }

    const costMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i < rowCount && j < colCount) {
                const score = scoreMatrix[i][j];
                costMatrix[i][j] = maxScore - score;
            } else {
                costMatrix[i][j] = maxScore + 1; // ダミー用大コスト
            }
        }
    }

    return costMatrix;
}

export function runMatching(participants, items, preferenceMap) {
    // ランダムにparticipantsをシャッフルし、preferenceMapも同順で並び替える
    const indexed = participants.map((p, idx) => ({ p, idx }));
    shuffleArray(indexed);
    const shuffledParticipants = indexed.map(x => x.p);

    const shuffledPrefMap = {};
    for (let p of shuffledParticipants) {
        shuffledPrefMap[p] = preferenceMap[p];
    }

    const nItems = items.length;
    // スコア行列作成
    const scoreMatrix = shuffledParticipants.map((p) => {
        const prefs = shuffledPrefMap[p];
        return items.map((item) => {
            const rank = prefs.indexOf(item);
            return (rank === -1) ? 0 : (nItems - rank);
        });
    });

    const costMatrix = buildCostMatrix(scoreMatrix);
    const assignment = hungarian(costMatrix);

    const result = {};
    for (let i = 0; i < shuffledParticipants.length; i++) {
        const assignedIndex = assignment[i];
        if (assignedIndex < items.length) {
            result[shuffledParticipants[i]] = items[assignedIndex];
        }
    }

    return result;
}
