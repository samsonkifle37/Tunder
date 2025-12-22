const statsService = require('./statsService');

const weightedRandom = (items, weights) => {
    let i;
    for (i = 0; i < weights.length; i++) {
        weights[i] += weights[i - 1] || 0;
    }
    const random = Math.random() * weights[weights.length - 1];
    for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) break;
    }
    return items[i];
};

const generateNumbers = (freqMap, count, range) => {
    const numbers = [];
    const items = Object.keys(freqMap).map(Number);
    const weights = items.map(n => freqMap[n] + 1); // +1 smoothing

    while (numbers.length < count) {
        const num = weightedRandom(items, weights);
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b);
};

const dataService = require('./dataService');

exports.generateTickets = async () => {
    const stats = await statsService.calculateStats();
    if (stats.error) throw new Error(stats.error);

    // Fetch raw data for pattern analysis
    const allDraws = await dataService.getData();
    // Sort just in case (though file structure assumes order)
    const sortedDraws = allDraws.sort((a, b) => b.drawId - a.drawId);
    const last12 = sortedDraws.slice(0, 12);

    // --- Even/Odd Pattern Analysis ---
    const patternFreq = {};
    last12.forEach(draw => {
        let odd = 0;
        let even = 0;
        draw.numbers.forEach(n => {
            if (n % 2 === 0) even++;
            else odd++;
        });
        const key = `${odd}-${even}`; // "3-2" for 3 Odd, 2 Even
        patternFreq[key] = (patternFreq[key] || 0) + 1;
    });

    // Find Mode Pattern
    let dominantPattern = null;
    let maxCount = -1;

    Object.entries(patternFreq).forEach(([key, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantPattern = key;
        }
    });

    // Fallback if something weird happens
    if (!dominantPattern) dominantPattern = "3-2";

    const [targetOdd, targetEven] = dominantPattern.split('-').map(Number);

    const mainFreq = stats.mainstats.frequency;
    const tbFreq = stats.thunderballStats.frequency;

    const tickets = [];

    // 1. Hot-biased (Weighted by frequency)
    tickets.push({
        type: 'Hot Biased',
        main: generateNumbers(mainFreq, 5, 39),
        thunderball: generateNumbers(tbFreq, 1, 14)[0]
    });

    // 2. Mixed (Random mix from hot and cold pools)
    const hotMain = stats.mainstats.hot.map(h => h.number);
    const coldMain = stats.mainstats.cold.map(c => c.number);

    // Helper to pick random from array
    const pick = (arr, n) => {
        const result = [];
        const copy = [...arr];
        for (let i = 0; i < n; i++) {
            if (copy.length === 0) break;
            const idx = Math.floor(Math.random() * copy.length);
            result.push(copy[idx]);
            copy.splice(idx, 1);
        }
        return result;
    };

    const mixedMain = [
        ...pick(hotMain, 3),
        ...pick(coldMain, 2)
    ].sort((a, b) => a - b);

    // Fill if not enough
    while (mixedMain.length < 5) {
        let n = Math.floor(Math.random() * 39) + 1;
        if (!mixedMain.includes(n)) mixedMain.push(n);
    }
    mixedMain.sort((a, b) => a - b);

    tickets.push({
        type: 'Mixed (Hot & Cold)',
        main: mixedMain,
        thunderball: pick(stats.thunderballStats.hot.map(h => h.number), 1)[0] || 1
    });


    // 3. Balanced spread
    const balancedMain = [];
    const decades = [[1, 9], [10, 19], [20, 29], [30, 39]];
    decades.forEach(([min, max]) => {
        let n = Math.floor(Math.random() * (max - min + 1)) + min;
        balancedMain.push(n);
    });
    while (balancedMain.length < 5) {
        let n = Math.floor(Math.random() * 39) + 1;
        if (!balancedMain.includes(n)) balancedMain.push(n);
    }

    tickets.push({
        type: 'Balanced Spread',
        main: balancedMain.sort((a, b) => a - b),
        thunderball: Math.floor(Math.random() * 14) + 1
    });

    // 4 & 5. Pattern Match Tickets
    const generatePatternNumbers = (nOdd, nEven) => {
        const odds = [];
        const evens = [];
        for (let i = 1; i <= 39; i++) {
            if (i % 2 === 0) evens.push(i);
            else odds.push(i);
        }

        const selection = [
            ...pick(odds, nOdd),
            ...pick(evens, nEven)
        ];
        return selection.sort((a, b) => a - b);
    };

    for (let i = 0; i < 2; i++) {
        tickets.push({
            type: `Pattern Match (${targetOdd} Odd / ${targetEven} Even)`,
            main: generatePatternNumbers(targetOdd, targetEven),
            thunderball: Math.floor(Math.random() * 14) + 1 // Random TB for now
        });
    }

    return tickets;
};
